export interface DataGenerator {
    init(): void;
    generateJSON(): string[];
    generateTXT(): string[];
}