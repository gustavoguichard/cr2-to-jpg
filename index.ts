import { argv } from 'bun'
import cr2Raw from 'cr2-raw'
import { readdir } from 'node:fs/promises'

const convert = async (source: string, destination: string): Promise<void> => {
  try {
    const raw = cr2Raw(source)
    const previewImage = raw.previewImage()
    if (!previewImage) throw new Error('No preview image found in CR2 file.')

    Bun.write(destination, previewImage)
  } catch (error) {
    console.error(`Error converting ${source}:`, error)
  }
}

// Get source and destination folders from arguments
const sourceFolder = argv[2] || './CR2' // default to './CR2' if not provided
const destinationFolder = argv[3] || './JPG' // default to './JPG' if not provided

// Read files in the source folder
const files = await readdir(sourceFolder)

// Wait for all conversions to finish
await Promise.all(
  files
    .filter((file) => file.endsWith('.CR2'))
    .map((file) => {
      const source = `${sourceFolder}/${file}`
      const destination = `${destinationFolder}/${file}`.replace('.CR2', '.jpg')
      return convert(source, destination)
    }),
)

console.log('Conversion completed.')
