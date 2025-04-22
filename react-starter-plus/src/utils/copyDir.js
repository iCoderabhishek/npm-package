import fs from 'fs/promises'
import path from 'path'

export async function copyDir(srcDir, destDir) {
  await fs.mkdir(destDir, { recursive: true })
  const entries = await fs.readdir(srcDir, { withFileTypes: true })

  for (const entry of entries) {
    const srcPath = path.join(srcDir, entry.name)
    const destPath = path.join(destDir, entry.name)

    if (entry.isDirectory()) {
      await copyDir(srcPath, destPath)
    } else {
      const data = await fs.readFile(srcPath)
      await fs.writeFile(destPath, data)
    }
  }
}
