import fs from "fs/promises";
import path from "path";
import { Assignment, Note } from "../types";

// Database file paths
const DB_DIR = path.join(__dirname, "../../data");
const ASSIGNMENTS_FILE = path.join(DB_DIR, "assignments.json");
const NOTES_FILE = path.join(DB_DIR, "notes.json");

// Initialize database files
export const initializeDatabase = async (): Promise<void> => {
	try {
		
		await fs.mkdir(DB_DIR, { recursive: true });

		
		try {
			await fs.access(ASSIGNMENTS_FILE);
		} catch {
			await fs.writeFile(ASSIGNMENTS_FILE, JSON.stringify([], null, 2));
			console.log("📄 Created assignments.json");
		}

		
		try {
			await fs.access(NOTES_FILE);
		} catch {
			await fs.writeFile(NOTES_FILE, JSON.stringify([], null, 2));
			console.log("📄 Created notes.json");
		}

		console.log("🗄️ Database initialized successfully");
	} catch (error) {
		console.error("❌ Failed to initialize database:", error);
		throw error;
	}
};


class JsonDatabase<T> {
	private filePath: string;

	constructor(filePath: string) {
		this.filePath = filePath;
	}


	async readAll(): Promise<T[]> {
		try {
			const data = await fs.readFile(this.filePath, "utf8");
			return JSON.parse(data) as T[];
		} catch (error) {
			console.error(`Error reading ${this.filePath}:`, error);
			return [];
		}
	}

	
	async writeAll(data: T[]): Promise<void> {
		try {
			await fs.writeFile(this.filePath, JSON.stringify(data, null, 2));
		} catch (error) {
			console.error(`Error writing ${this.filePath}:`, error);
			throw error;
		}
	}


	async findById(
		id: string,
		idField: keyof T = "id" as keyof T
	): Promise<T | null> {
		const records = await this.readAll();
		return records.find((record) => record[idField] === id) || null;
	}


	async findBy(criteria: Partial<T>): Promise<T[]> {
		const records = await this.readAll();
		return records.filter((record) => {
			return Object.keys(criteria).every((key) => {
				const typedKey = key as keyof T;
				return record[typedKey] === criteria[typedKey];
			});
		});
	}

	
	async create(record: T): Promise<T> {
		const records = await this.readAll();
		records.push(record);
		await this.writeAll(records);
		return record;
	}


	async updateById(
		id: string,
		updates: Partial<T>,
		idField: keyof T = "id" as keyof T
	): Promise<T | null> {
		const records = await this.readAll();
		const index = records.findIndex((record) => record[idField] === id);

		if (index === -1) {
			return null;
		}

		records[index] = { ...records[index], ...updates };
		await this.writeAll(records);
		return records[index];
	}


	async deleteById(
		id: string,
		idField: keyof T = "id" as keyof T
	): Promise<boolean> {
		const records = await this.readAll();
		const initialLength = records.length;
		const filteredRecords = records.filter(
			(record) => record[idField] !== id
		);

		if (filteredRecords.length === initialLength) {
			return false;
		}

		await this.writeAll(filteredRecords);
		return true;
	}

	
	async count(): Promise<number> {
		const records = await this.readAll();
		return records.length;
	}
}


export const assignmentsDB = new JsonDatabase<Assignment>(ASSIGNMENTS_FILE);
export const notesDB = new JsonDatabase<Note>(NOTES_FILE);


export const dbUtils = {

	async backup(): Promise<void> {
		const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
		const backupDir = path.join(DB_DIR, "backups");

		await fs.mkdir(backupDir, { recursive: true });

		await fs.copyFile(
			ASSIGNMENTS_FILE,
			path.join(backupDir, `assignments-${timestamp}.json`)
		);
		await fs.copyFile(
			NOTES_FILE,
			path.join(backupDir, `notes-${timestamp}.json`)
		);

		console.log(`📦 Database backed up at ${timestamp}`);
	},

	
	async clearAll(): Promise<void> {
		await assignmentsDB.writeAll([]);
		await notesDB.writeAll([]);
		console.log("🗑️ All database data cleared");
	},

	
	async getStats(): Promise<{ assignments: number; notes: number }> {
		return {
			assignments: await assignmentsDB.count(),
			notes: await notesDB.count(),
		};
	},
};
