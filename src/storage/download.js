// Copyright 2024-2026 Pittica S.r.l.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

const path = require("path")
const { Storage, TransferManager } = require("@google-cloud/storage")
const log = require("@pittica/logger-helpers")
const fs = require("fs")

/**
 * Downloads all files from given bucket.
 *
 * @param {string} bucket Bucket name.
 * @param {string} destination Destination path.
 */
exports.downloadBucket = async (bucket, destination = __dirname) => {
  const storage = new Storage()
  const source = storage.bucket(bucket)
  const [files] = await source.getFiles()

  files.forEach(({ name }) => exports.downloadFile(name, source, destination))
}

/**
 * Downloads a file from the given bucket.
 *
 * @param {string} file File name.
 * @param {Bucket} bucket Google Cloud Storage bucket object.
 * @param {string} directory Destination directory.
 */
exports.downloadFile = async (file, bucket, directory = __dirname) => {
  const destination = path.join(directory, file)
  const folder = path.dirname(destination)

  if (!fs.existsSync(folder)) {
    fs.mkdirSync(folder, 0o744)
  }

  return bucket
    .file(file)
    .download({ destination })
    .then(() => log.info(`Downloading "${file}".`))
    .catch(() => log.error(`Failed downloading "${file}".`))
}

/**
 * Downloads a folder from the given bucket.
 *
 * @param {string} folder Folder name.
 * @param {Bucket} bucket Google Cloud Storage bucket object.
 * @param {string} directory Destination directory.
 *
 * @returns {Promise}
 */
exports.downloadFolder = (folder, bucket, directory = __dirname) => {
  const storage = new Storage()
  const manager = new TransferManager(storage.bucket(bucket))
  const destination = path.join(directory, folder)

  if (!fs.existsSync(destination)) {
    fs.mkdirSync(destination, { recursive: true, mode: 0o744 })
  }

  return manager.downloadManyFiles(folder, {
    passthroughOptions: { destination: directory },
  })
}
