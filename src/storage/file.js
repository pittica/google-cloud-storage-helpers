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

const { Storage } = require("@google-cloud/storage")
const log = require("@pittica/logger-helpers")
const { getStorage } = require("./storage")

/**
 * Moves all files from a bucket to another.
 *
 * @param {string} source Source bucket.
 * @param {string} destination Destination bucket.
 */
exports.moveFiles = async (source, destination) => {
  const storage = getStorage()
  const bucket = storage.bucket(destination)
  const [files] = await storage.bucket(source).getFiles()

  files.forEach((results) =>
    Array.isArray(results)
      ? results.forEach((file) => this.moveFile(file, bucket))
      : this.moveFile(results, bucket)
  )
}

/**
 * Moves a file from a bucket to another.
 *
 * @param {File} file File object.
 * @param {Bucket} bucket Bucket object.
 */
exports.moveFile = async (file, bucket) => {
  const { id } = file
  const source = file.metadata.bucket
  const destination = bucket.id

  log.info(`Moving "${id}" from "${source}" to "${destination}"`)

  file
    .copy(bucket.file(id))
    .then(() =>
      this.deleteFile(file)
        ? log.success(`Moved "${id}" from "${source}" to "${destination}"`)
        : log.error(`Failed deleted "${id}" in "${source}"`)
    )
    .catch(() =>
      log.error(`Failed moving "${id}" from "${source}" to "${destination}"`)
    )
}

/**
 * Copies the given file from a bucket to another.
 *
 * @param {File} source Source file.
 * @param {string} destination Destination bucket.
 * @returns {Promise}
 */
exports.copyFile = (source, destination) =>
  source.copy(source.storage.bucket(destination).file(source.id))

/**
 * Deletes a file in Google Cloud Storage.
 *
 * @param {File} file Cloud Storage file object.
 * @returns {boolean} A value indicating wheter the file has been deleted.
 */
exports.deleteFile = (file) =>
  file
    .delete()
    .then((response) => {
      const [res] = response

      return res.statusCode >= 200 && res.statusCode < 300
    })
    .catch(() => false)

/**
 * Gets the files from the given bucket.
 *
 * @param {Storage} storage Google Cloud Storage object.
 * @param {string} bucket Bucket name.
 * @param {string} prefix Files prefix.
 * @returns {Array} Files from the given bucket.
 */
exports.getFiles = (storage, source, prefix) =>
  storage
    .bucket(source)
    .getFiles({ prefix, autoPaginate: false })
    .then((files) => files)
    .catch(() => [])

/**
 * Lists the files from the given bucket.
 *
 * @param {string} bucket Bucket name.
 * @param {string} prefix Files prefix.
 * @returns {Array} Files from the given bucket.
 * @since 1.3.0
 */
exports.listFiles = (source, prefix) =>
  getStorage()
    .bucket(source)
    .getFiles({ prefix, autoPaginate: false, fields: "items(name)" })
    .then((res) => {
      const [items] = res
      return items.map(({ name }) => name)
    })
    .catch(() => [])

/**
 * Lists the folders from the given bucket.
 *
 * @param {string} bucket Bucket name.
 * @param {string} prefix Files prefix.
 * @returns {Array} Folders from the given bucket.
 * @since 1.3.0
 */
exports.listFolders = async (source, prefix = "") =>
  await getStorage()
    .bucket(source)
    .getFiles({
      prefix,
      autoPaginate: false,
      delimiter: "/",
      fields: "prefixes",
    })
    .then((res) => {
      const [, , { prefixes }] = res

      return prefixes.map((prefix) => prefix.replace(/\/+$/, ""))
    })
    .catch(() => [])

/**
 * Process the response from copy API and extracts the response file object.
 *
 * @param {Array} response Response.
 * @returns {File} File object or a null value.
 */
exports.copiedFile = (response) => {
  if (typeof response[1] !== "undefined" && response[1].done) {
    return response[0]
  }

  return null
}
