import { Editor } from '@tinymce/tinymce-react'
import React from 'react'

const RichTextEditor = ({value, onChange}) => {
  return (
    <div>
               {/* TinyMCE Editor */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Description
                    </label>
                    <Editor
                      apiKey='9aijnxaml00pchdfs0tw562y07q0vt808si0sc83gbkpw5se' 
                      init={{
                        height: 300,
                        menubar: true,
                        plugins: [
                          'advlist', 'autolink', 'lists', 'link', 'image', 
                          'charmap', 'preview', 'anchor', 'searchreplace', 'visualblocks', 
                          'code', 'fullscreen', 'insertdatetime', 'media', 'table', 
                          'help', 'wordcount'
                        ],
                        toolbar: 'undo redo | blocks | ' +
                          'bold italic forecolor | alignleft aligncenter ' +
                          'alignright alignjustify | bullist numlist outdent indent | ' +
                          'removeformat | help',
                        content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }'
                      }}
                      value={value}
                      onEditorChange={onChange}
                    />
                  </div>
    </div>
  )
}

export default RichTextEditor
