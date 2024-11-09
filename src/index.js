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

const { copyFile, deleteFile, moveFiles } = require("./storage/file")
const { bucket, file, folder } = require("./storage/download")
const { write } = require("./storage/json")

exports.copyFile = copyFile
exports.deleteFile = deleteFile
exports.moveFiles = moveFiles
exports.downloadFile = file
exports.downloadBucket = bucket
exports.downloadFolder = folder
exports.writeJson = write
