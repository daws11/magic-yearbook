#!/usr/bin/env node
/**
 * Converts all images and videos in public/images/ to webp and webm formats.
 * Generates public/media-list.json for the gallery to consume.
 */

import { readdir, stat, writeFile } from 'fs/promises'
import { join, extname, basename } from 'path'
import { fileURLToPath } from 'url'
import sharp from 'sharp'
import { spawn } from 'child_process'

const __dirname = fileURLToPath(new URL('.', import.meta.url))
const ROOT = join(__dirname, '..')
const IMAGES_DIR = join(ROOT, 'public', 'images')

const IMAGE_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.gif', '.bmp']
const VIDEO_EXTENSIONS = ['.mp4', '.mov', '.avi', '.mkv']

const mediaList = []

function runFfmpeg(args) {
  return new Promise((resolve, reject) => {
    const proc = spawn('ffmpeg', args, { stdio: 'pipe' })
    proc.on('close', (code) => (code === 0 ? resolve() : reject(new Error(`ffmpeg exited ${code}`))))
    proc.on('error', reject)
  })
}

async function convertImage(inputPath, outputPath) {
  await sharp(inputPath)
    .webp({ quality: 85 })
    .toFile(outputPath)
}

async function convertVideo(inputPath, outputPath) {
  await runFfmpeg([
    '-i', inputPath,
    '-c:v', 'libvpx-vp9',
    '-crf', '30',
    '-b:v', '0',
    '-an',
    '-y',
    outputPath
  ])
}

async function main() {
  const files = await readdir(IMAGES_DIR)
  const toProcess = files.filter((f) => !f.startsWith('.'))

  for (const file of toProcess) {
    const inputPath = join(IMAGES_DIR, file)
    const fileStat = await stat(inputPath)
    if (!fileStat.isFile()) continue

    const ext = extname(file).toLowerCase()
    const base = basename(file, ext)

    if (IMAGE_EXTENSIONS.includes(ext)) {
      const outputPath = join(IMAGES_DIR, `${base}.webp`)
      if (outputPath !== inputPath) {
        console.log(`Converting image: ${file} → ${base}.webp`)
        await convertImage(inputPath, outputPath)
        mediaList.push({ type: 'image', src: `/images/${base}.webp`, caption: base })
      }
    } else if (VIDEO_EXTENSIONS.includes(ext)) {
      const outputPath = join(IMAGES_DIR, `${base}.webm`)
      console.log(`Converting video: ${file} → ${base}.webm`)
      await convertVideo(inputPath, outputPath)
      mediaList.push({ type: 'video', src: `/images/${base}.webm`, caption: base })
    }
  }

  // Include any pre-existing .webp/.webm not yet in manifest (e.g. from prior run)
  const existingSrcs = new Set(mediaList.map((m) => m.src))
  for (const file of toProcess) {
    const ext = extname(file).toLowerCase()
    const base = basename(file, ext)
    const src = `/images/${file}`
    if (ext === '.webp' && !existingSrcs.has(src)) {
      mediaList.push({ type: 'image', src, caption: base })
      existingSrcs.add(src)
    } else if (ext === '.webm' && !existingSrcs.has(src)) {
      mediaList.push({ type: 'video', src, caption: base })
      existingSrcs.add(src)
    }
  }

  // Sort: images first, then videos; alphabetically within each group
  mediaList.sort((a, b) => {
    if (a.type !== b.type) return a.type === 'image' ? -1 : 1
    return a.caption.localeCompare(b.caption)
  })

  const manifestPath = join(ROOT, 'public', 'media-list.json')
  await writeFile(manifestPath, JSON.stringify(mediaList, null, 2), 'utf8')
  console.log(`\nWrote ${mediaList.length} media items to public/media-list.json`)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
