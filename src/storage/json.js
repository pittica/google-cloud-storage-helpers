// Copyright 2024 Pittica S.r.l.
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

/**
 * Writes JSON data.
 *
 * @param {string} file File name and path.
 * @param {object} body Document body.
 *
 * @returns {boolean} Write action response.
 */
exports.write = async (file, body, bucket) => {
  const storage = new Storage()

  const stream = storage
    .bucket(bucket)
    .file(file)
    .createWriteStream({
      metadata: {
        contentType: "application/json",
      },
    })

  stream.on("error", (error) => log.error(error))
  stream.on("finish", () => log.success(`"${file}" has been written.`))

  const buffer = Buffer.from(JSON.stringify(body))

  return stream.end(buffer)
}
