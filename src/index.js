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

const {
  copyFile,
  deleteFile,
  moveFiles,
  getFiles,
  listFiles,
  listFolders,
  copiedFile,
} = require("./storage/file")
const {
  downloadBucket,
  downloadFile,
  downloadFolder,
} = require("./storage/download")
const { writeJson, groupJson } = require("./storage/json")
const { getStorage } = require("./storage/storage")

exports.copyFile = copyFile
exports.deleteFile = deleteFile
exports.moveFiles = moveFiles
exports.getFiles = getFiles
exports.listFiles = listFiles
exports.listFolders = listFolders
exports.copiedFile = copiedFile
exports.writeJson = writeJson
exports.groupJson = groupJson
exports.downloadFile = downloadFile
exports.downloadBucket = downloadBucket
exports.downloadFolder = downloadFolder
exports.getStorage = getStorage
