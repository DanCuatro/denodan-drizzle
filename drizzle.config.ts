import { defineConfig } from "drizzle-kit";
export default defineConfig({
  dialect: 'turso',
  schema: './db/schema/users.ts',
  out: "./drizzle",
  dbCredentials: {
    url: "libsql://test-storage-dancuatro.turso.io", 
    authToken:"eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJpYXQiOjE3MzE3MDY0MjEsImlkIjoiNjU1ZmI1M2YtZWEwOC00MmViLTlhY2EtZmQ1YzNiNjg4ZDY2In0.p3CVXHUyk-yCym6deQMplANmn63FRE6LfpP80aNMLqpf-paRQls0-quwozVwX59Xuzu9EHD5Bw61r-fSgnjrBQ" 
  }
  
})