#!/usr/bin/env node
/** Build media-list.json from existing .webp and .webm files in public/images/ */

import { readdir, stat, writeFile } from 'fs/promises'
import { join, extname, basename } from 'path'
import { fileURLToPath } from 'url'

const __dirname = fileURLToPath(new URL('.', import.meta.url))
const ROOT = join(__dirname, '..')
const IMAGES_DIR = join(ROOT, 'public', 'images')

async function main() {
  const files = await readdir(IMAGES_DIR)
  const mediaList = []

  for (const file of files) {
    if (file.startsWith('.')) continue
    const inputPath = join(IMAGES_DIR, file)
    const fileStat = await stat(inputPath)
    if (!fileStat.isFile()) continue

    const ext = extname(file).toLowerCase()
    const base = basename(file, ext)

    if (ext === '.webp') {
      mediaList.push({ type: 'image', src: `/images/${file}`, caption: base })
    } else if (ext === '.webm') {
      mediaList.push({ type: 'video', src: `/images/${file}`, caption: base })
    }
  }

  mediaList.sort((a, b) => {
    if (a.type !== b.type) return a.type === 'image' ? -1 : 1
    return a.caption.localeCompare(b.caption)
  })

  const manifestPath = join(ROOT, 'public', 'media-list.json')
  await writeFile(manifestPath, JSON.stringify(mediaList, null, 2), 'utf8')
  console.log(`Wrote ${mediaList.length} media items to public/media-list.json`)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
