export function getTimestampDiffSQL(field1: string, field2: string): string {
    return `floor(extract(epoch from (${field2} - ${field1})))`;
}