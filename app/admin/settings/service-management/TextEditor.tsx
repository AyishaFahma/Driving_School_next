




import React, { useState, useRef } from 'react';
import { FaListOl, FaListUl } from 'react-icons/fa';
import { IoIosArrowDown, IoIosArrowUp } from 'react-icons/io';

type TextEditorProps = {
  value: string;
  onChange: (value: string) => void;
};

const TextEditor: React.FC<TextEditorProps> = ({ value, onChange }) => {
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isUnderline, setIsUnderline] = useState(false);
  const [isStrikethrough, setIsStrikethrough] = useState(false);
  const [isBlockquote, setIsBlockquote] = useState(false);
  const [isCode, setIsCode] = useState(false);
  const [linkUrl, setLinkUrl] = useState('');
  const [selectedFont, setSelectedFont] = useState<string>('Arial');
  const [selectedFontSize, setSelectedFontSize] = useState<string>('3'); // Default to medium size
  const [selectedColor, setSelectedColor] = useState<string>('#000000');
  const [selectedBgColor, setSelectedBgColor] = useState<string>('#FFFFFF');
  const [isColorDropdownVisible, setIsColorDropdownVisible] = useState(false);
  const [isBgColorDropdownVisible, setIsBgColorDropdownVisible] = useState(false);


 
  const editorRef = useRef<HTMLDivElement | null>(null);


  const handleCommand = (command: string, value?: string) => {
    document.execCommand(command, false, value || '');
    updateToolbarState(); // Ensure toolbar updates correctly
  };

  const updateToolbarState = () => {
    setIsBold(document.queryCommandState('bold'));
    setIsItalic(document.queryCommandState('italic'));
    setIsUnderline(document.queryCommandState('underline'));
    setIsStrikethrough(document.queryCommandState('strikeThrough'));
    setIsBlockquote(document.queryCommandState('blockquote'));
    setIsCode(document.queryCommandState('insertHTML') && document.queryCommandValue('insertHTML') === 'code');
  };

  // Apply blockquote formatting
  const applyBlockquote = () => {
    document.execCommand('formatBlock', false, 'blockquote');
    updateToolbarState();
  };
  // Apply code formatting
  const applyCodeFormatting = () => {
    const selection = window.getSelection();
    if (selection && selection.toString()) {
      const selectedText = selection.toString();
      const formattedCode = `<pre><code>${selectedText}</code></pre>`;
      document.execCommand('insertHTML', false, formattedCode);
    }
  };
  // Function to insert a link
  const insertLink = () => {
    if (linkUrl) {
      document.execCommand('createLink', false, linkUrl);
      setLinkUrl(''); // Clear the link input after inserting
    }
    updateToolbarState();
  };
   // Function to insert an image
   const insertImage = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const imageUrl = reader.result as string;
        const imgTag = `<img src="${imageUrl}" alt="Image" class="max-w-full h-auto" />`;
        document.execCommand('insertHTML', false, imgTag);
      };
      reader.readAsDataURL(file);
    }
  };
// Function to insert a video URL (YouTube, Vimeo, etc.)
const insertVideoFromURL = () => {
  const url = prompt('Enter the video URL (YouTube, Vimeo, etc.):');
  if (url) {
    const embedCode = `<iframe width="560" height="315" src="${url}" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`;
    document.execCommand('insertHTML', false, embedCode);
  }
};

  const applyFontFamily = (font: string) => {
    document.execCommand('fontName', false, font);
    setSelectedFont(font);
  };

  const applyFontSize = (size: string) => {
    document.execCommand('fontSize', false, size);
    setSelectedFontSize(size);
  };

  const applyTextColor = (color: string) => {
    document.execCommand('foreColor', false, color);
    setSelectedColor(color);
  };

  const applyBgColor = (color: string) => {
    document.execCommand('hiliteColor', false, color);
    setSelectedBgColor(color);
  };

  const toggleColorDropdown = () => {
    setIsColorDropdownVisible(!isColorDropdownVisible);
    setIsBgColorDropdownVisible(false);
  };

  const toggleBgColorDropdown = () => {
    setIsBgColorDropdownVisible(!isBgColorDropdownVisible);
    setIsColorDropdownVisible(false);
  };

  const resetColor = () => {
    document.execCommand('foreColor', false, '#000000');
    setSelectedColor('#000000');
  };

  const resetBgColor = () => {
    document.execCommand('hiliteColor', false, '#FFFFFF');
    setSelectedBgColor('#FFFFFF');
  };

  React.useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML !== value) {
      editorRef.current.innerHTML = value;
    }
  }, [value]);


  const handleInput = () => {
    if (editorRef.current) {
      const newValue = editorRef.current.innerHTML;
      if (newValue !== value) {
        onChange(newValue); // Only update if value changes
      }
    }
  };
  

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter') {
      document.execCommand('defaultParagraphSeparator', false, 'p'); // Ensures new lines are wrapped in <p>
    }
  };
  const handleClickInsideEditor = (event: React.MouseEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
  };

  return (
    <div className="mt-4 w-full border border-gray-200 rounded-lg bg-gray-50 dark:bg-gray-700 dark:border-gray-600">
      <div className="px-3 py-2 border-b dark:border-gray-600">
        <div className="flex flex-wrap items-center space-x-1">
          {/* Existing buttons for bold, italic, underline, etc. */}
          <button
          type="button"
            onClick={() => handleCommand('bold')}
            className={`p-1.5 rounded cursor-pointer ${
              isBold ? 'text-blue-500' : 'text-gray-500'
            } hover:text-gray-900 dark:hover:text-white`}
          >
            <svg
              className="w-5 h-5"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
            >
              <path
                d="M8 5h4.5a3.5 3.5 0 1 1 0 7H8m0-7v7m0-7H6m2 7h6.5a3.5 3.5 0 1 1 0 7H8m0-7v7m0 0H6"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
              />
            </svg>
            <span className="sr-only">Bold</span>
          </button>
          <button
           type="button"
            onClick={() => handleCommand('italic')}
            className={`p-1.5 rounded cursor-pointer ${
              isItalic ? 'text-blue-500' : 'text-gray-500'
            } hover:text-gray-900 dark:hover:text-white`}
          >
            <svg
              className="w-5 h-5"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
            >
              <path
                d="m8.874 19 6.143-14M6 19h6.33m-.66-14H18"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
              />
            </svg>
            <span className="sr-only">Italic</span>
          </button>
          <button
           type="button"
            onClick={() => handleCommand('underline')}
            className={`p-1.5 rounded cursor-pointer ${
              isUnderline ? 'text-blue-500' : 'text-gray-500'
            } hover:text-gray-900 dark:hover:text-white`}
          >
            <svg
              className="w-5 h-5"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
            >
              <path
                d="M6 19h12M8 5v9a4 4 0 0 0 8 0V5M6 5h4m4 0h4"
                stroke="currentColor"
                strokeLinecap="round"
                strokeWidth="2"
              />
            </svg>
            <span className="sr-only">Underline</span>
          </button>
          {/* Strike-through Button */}
          <button
           type="button"
            onClick={() => handleCommand('strikeThrough')}
            className={`p-1.5 rounded cursor-pointer ${
              isStrikethrough ? 'text-blue-500' : 'text-gray-500'
            } hover:text-gray-900 dark:hover:text-white`}
          >
            <svg
              className="w-5 h-5"
              xmlns="http://www.w3.org/2000/svg"
              width={24}
              height={24}
              fill="none"
              viewBox="0 0 24 24"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 6.2V5h12v1.2M7 19h6m.2-14-1.677 6.523M9.6 19l1.029-4M5 5l6.523 6.523M19 19l-7.477-7.477"
              />
            </svg>
            <span className="sr-only">Strike-through</span>
          </button>
          {/* Blockquote Button */}
          <button
           type="button"
            onClick={applyBlockquote}
            className={`p-1.5 rounded cursor-pointer ${
              isBlockquote ? 'text-blue-500' : 'text-gray-500'
            } hover:text-gray-900 dark:hover:text-white`}
          >
            <svg
              className="w-5 h-5"
              xmlns="http://www.w3.org/2000/svg"
              width={24}
              height={24}
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                fillRule="evenodd"
                d="M6 6a2 2 0 0 0-2 2v3a2 2 0 0 0 2 2h3a3 3 0 0 1-3 3H5a1 1 0 1 0 0 2h1a5 5 0 0 0 5-5V8a2 2 0 0 0-2-2H6Zm9 0a2 2 0 0 0-2 2v3a2 2 0 0 0 2 2h3a3 3 0 0 1-3 3h-1a1 1 0 1 0 0 2h1a5 5 0 0 0 5-5V8a2 2 0 0 0-2-2h-3Z"
                clipRule="evenodd"
              />
            </svg>
            <span className="sr-only">Blockquote</span>
          </button>
          {/* Format Code Button */}
          <button
           type="button"
            onClick={applyCodeFormatting}
            className={`p-1.5 rounded cursor-pointer ${
              isCode ? 'text-blue-500' : 'text-gray-500'
            } hover:text-gray-900 dark:hover:text-white`}
          >
            <svg
              className="w-5 h-5"
              xmlns="http://www.w3.org/2000/svg"
              width={24}
              height={24}
              fill="none"
              viewBox="0 0 24 24"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="m8 8-4 4 4 4m8 0 4-4-4-4m-2-3-4 14"
              />
            </svg>
            <span className="sr-only">Code</span>
          </button>
          <button
           type="button"
            onClick={() => {
              const url = prompt('Enter the URL for the link:');
              if (url) {
                setLinkUrl(url);
                insertLink(); // Insert the link after setting the URL
              }
            }}
            className={`p-1.5 rounded cursor-pointer ${linkUrl ? 'text-blue-500' : 'text-gray-500'} hover:text-gray-900 dark:hover:text-white`}
          >
            {/* Link button icon */}
            <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width={24} height={24} fill="none" viewBox="0 0 24 24">
            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.213 9.787a3.391 3.391 0 0 0-4.795 0l-3.425 3.426a3.39 3.39 0 0 0 4.795 4.794l.321-.304m-.321-4.49a3.39 3.39 0 0 0 4.795 0l3.424-3.426a3.39 3.39 0 0 0-4.794-4.795l-1.028.961" />
          </svg>
            <span className="sr-only">Insert Link</span>
          </button>
          {/* Image Upload Button */}
          <label className="p-1.5 rounded cursor-pointer text-gray-500 hover:text-gray-900 dark:hover:text-white">
          <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width={24} height={24} fill="currentColor" viewBox="0 0 24 24">
          <path fillRule="evenodd" d="M13 10a1 1 0 0 1 1-1h.01a1 1 0 1 1 0 2H14a1 1 0 0 1-1-1Z" clipRule="evenodd" />
          <path fillRule="evenodd" d="M2 6a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v12c0 .556-.227 1.06-.593 1.422A.999.999 0 0 1 20.5 20H4a2.002 2.002 0 0 1-2-2V6Zm6.892 12 3.833-5.356-3.99-4.322a1 1 0 0 0-1.549.097L4 12.879V6h16v9.95l-3.257-3.619a1 1 0 0 0-1.557.088L11.2 18H8.892Z" clipRule="evenodd" />
        </svg>
            <span className="sr-only">Upload Image</span>
            {/* Hidden file input */}
            <input
              type="file"
              accept="image/*"
              onChange={insertImage}
              className="hidden"
            />
          </label>
 {/* Video URL Insert Button */}
 <button
  type="button"
            onClick={insertVideoFromURL}
            className={`p-1.5 rounded cursor-pointer text-gray-500 hover:text-gray-900 dark:hover:text-white`}
          >
            {/* Video URL button icon */}
            <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width={24} height={24} fill="currentColor" viewBox="0 0 24 24">
          <path fillRule="evenodd" d="M9 7V2.221a2 2 0 0 0-.5.365L4.586 6.5a2 2 0 0 0-.365.5H9Zm2 0V2h7a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V9h5a2 2 0 0 0 2-2Zm-2 4a2 2 0 0 0-2 2v2a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2v-2a2 2 0 0 0-2-2H9Zm0 2h2v2H9v-2Zm7.965-.557a1 1 0 0 0-1.692-.72l-1.268 1.218a1 1 0 0 0-.308.721v.733a1 1 0 0 0 .37.776l1.267 1.032a1 1 0 0 0 1.631-.776v-2.984Z" clipRule="evenodd" />
        </svg>
            <span className="sr-only">Insert Video URL</span>
          </button>
        
 {/* Text Color Button with Dropdown */}
 <button
  type="button"
            onClick={toggleColorDropdown}
            className="p-1.5 text-gray-500 rounded cursor-pointer hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-600"
          >
            <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width={25} height={24} fill="none" viewBox="0 0 25 24">
              <path stroke="currentColor" strokeLinecap="round" strokeWidth={2} d="m6.532 15.982 1.573-4m-1.573 4h-1.1m1.1 0h1.65m-.077-4 2.725-6.93a.11.11 0 0 1 .204 0l2.725 6.93m-5.654 0H8.1m.006 0h5.654m0 0 .617 1.569m5.11 4.453c0 1.102-.854 1.996-1.908 1.996-1.053 0-1.907-.894-1.907-1.996 0-1.103 1.907-4.128 1.907-4.128s1.909 3.025 1.909 4.128Z" />
            </svg>
            <span className="sr-only">Text color</span>
          </button>
 {/* Color Picker Dropdown */}
          {isColorDropdownVisible && (
            <div id="textColorDropdown" className="z-10 w-48 rounded bg-white p-2 shadow dark:bg-gray-700">
              <div className="grid grid-cols-6 gap-2 mb-3 items-center p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600">
                <input
                  type="color"
                  id="color"
                  value={selectedColor}
                  onChange={(e) => applyTextColor(e.target.value)}
                  className="border-gray-200 border bg-gray-50 dark:bg-gray-700 dark:border-gray-600 rounded-md p-px px-1 hover:bg-gray-50 group-hover:bg-gray-50 dark:group-hover:bg-gray-700 w-full h-8 col-span-3"
                />
                <label
                  htmlFor="color"
                  className="text-gray-500 dark:text-gray-400 text-sm font-medium col-span-3 group-hover:text-gray-900 dark:group-hover:text-white"
                >
                  Pick a color
                </label>
              </div>
              <div className="grid grid-cols-6 gap-1 mb-3">
                {['#1A56DB', '#0E9F6E', '#FACA15', '#F05252', '#FF8A4C'].map((color) => (
                  <button
                    key={color}
                    type="button"
                    onClick={() => applyTextColor(color)}
                    style={{ backgroundColor: color }}
                    className="w-6 h-6 rounded-md"
                  >
                    <span className="sr-only">{color}</span>
                  </button>
                ))}
              </div>
              <button
                type="button"
                onClick={resetColor}
                className="py-1.5 text-sm font-medium text-gray-500 focus:outline-none bg-white rounded-lg hover:bg-gray-100 hover:text-gray-900 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-700 dark:text-gray-400 dark:hover:text-white w-full dark:hover:bg-gray-600"
              >
                Reset color
              </button>
            </div>
          )}
        {/* </div> */}

         
          {/* Add Ordered List Button */}
          <button
           type="button"
            onClick={() => handleCommand('insertOrderedList')}
            className="p-1.5 rounded cursor-pointer text-gray-500 hover:text-gray-900 dark:hover:text-white"
          >
          
            <FaListOl />
            
            <span className="sr-only">Ordered List</span>
          </button>

          {/* Add Unordered List Button */}
          <button
           type="button"
            onClick={() => handleCommand('insertUnorderedList')}
            className="p-1.5 rounded cursor-pointer text-gray-500 hover:text-gray-900 dark:hover:text-white"
          >
           
            <FaListUl />
            <span className="sr-only">Unordered List</span>
          </button>


          {/* Add Text Alignment Buttons */}
          {/* left */}
          <button
           type="button"
            onClick={() => handleCommand('justifyLeft')}
            className="p-1.5 rounded cursor-pointer text-gray-500 hover:text-gray-900 dark:hover:text-white"
          >
           <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width={24} height={24} fill="none" viewBox="0 0 24 24">
            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 6h8m-8 4h12M6 14h8m-8 4h12" />
          </svg>
            <span className="sr-only">Align Left</span>
          </button>
          {/* center */}
          <button
           type="button"
            onClick={() => handleCommand('justifyCenter')}
            className="p-1.5 rounded cursor-pointer text-gray-500 hover:text-gray-900 dark:hover:text-white"
          >
           <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width={24} height={24} fill="none" viewBox="0 0 24 24">
            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 6h8M6 10h12M8 14h8M6 18h12" />
          </svg>
            <span className="sr-only">Align Center</span>
          </button>
           {/* right */}
          <button
           type="button"
            onClick={() => handleCommand('justifyRight')}
            className="p-1.5 rounded cursor-pointer text-gray-500 hover:text-gray-900 dark:hover:text-white"
          >
          <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width={24} height={24} fill="none" viewBox="0 0 24 24">
            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 6h-8m8 4H6m12 4h-8m8 4H6" />
          </svg>
            <span className="sr-only">Align Right</span>
          </button>
{/* justify */}
          {/* <button
           type="button"
            onClick={() => handleCommand('justifyFull')}
            className="p-1.5 rounded cursor-pointer text-gray-500 hover:text-gray-900 dark:hover:text-white"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M3 14h18M3 18h18M3 6h18" />
            </svg>
            <span className="sr-only">Justify</span>
          </button> */}

          {/* Add Background Color Button */}
          <button
           type="button"
            onClick={toggleBgColorDropdown}
            className="p-1.5 text-gray-500 rounded cursor-pointer hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-600"
          >
<svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width={24} height={24} fill="none" viewBox="0 0 24 24">
            <path stroke="currentColor" strokeLinecap="round" strokeWidth={2} d="M9 19.2H5.5c-.3 0-.5-.2-.5-.5V16c0-.2.2-.4.5-.4h13c.3 0 .5.2.5.4v2.7c0 .3-.2.5-.5.5H18m-6-1 1.4 1.8h.2l1.4-1.7m-7-5.4L12 4c0-.1 0-.1 0 0l4 8.8m-6-2.7h4m-7 2.7h2.5m5 0H17" />
          </svg>
            <span className="sr-only">Background Color</span>
          </button>

          {/* Background Color Picker Dropdown */}
          {isBgColorDropdownVisible && (
            <div className="z-10 w-48 rounded bg-white p-2 shadow dark:bg-gray-700">
              <div className="grid grid-cols-6 gap-2 mb-3 items-center p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600">
                <input
                  type="color"
                  id="bgColor"
                  value={selectedBgColor}
                  onChange={(e) => applyBgColor(e.target.value)}
                  className="border-gray-200 border bg-gray-50 dark:bg-gray-700 dark:border-gray-600 rounded-md p-px px-1 hover:bg-gray-50 group-hover:bg-gray-50 dark:group-hover:bg-gray-700 w-full h-8 col-span-3"
                />
                <label
                  htmlFor="bgColor"
                  className="text-gray-500 dark:text-gray-400 text-sm font-medium col-span-3 group-hover:text-gray-900 dark:group-hover:text-white"
                >
                  Pick a color
                </label>
              </div>
              <div className="grid grid-cols-6 gap-1 mb-3">
                {['#FFFFFF', '#FEE2E2', '#FEF3C7', '#D1FAE5', '#DBEAFE', '#EDE9FE'].map((color) => (
                  <button
                    key={color}
                    type="button"
                    onClick={() => applyBgColor(color)}
                    style={{ backgroundColor: color }}
                    className="w-6 h-6 rounded-md"
                  >
                    <span className="sr-only">{color}</span>
                  </button>
                ))}
              </div>
              <button
                type="button"
                onClick={resetBgColor}
                className="py-1.5 text-sm font-medium text-gray-500 focus:outline-none bg-white rounded-lg hover:bg-gray-100 hover:text-gray-900 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-700 dark:text-gray-400 dark:hover:text-white w-full dark:hover:bg-gray-600"
              >
                Reset color
              </button>
            </div>
          )}

           {/* Add Font Size Dropdown */}
           <select
            value={selectedFontSize}
            onChange={(e) => applyFontSize(e.target.value)}
            className="p-1.5 rounded cursor-pointer text-gray-500 hover:text-gray-900 dark:hover:text-white dark:bg-navy-700"
          >
            <option value="1">Small</option>
            <option value="3">Medium</option>
            <option value="5">Large</option>
            <option value="7">Extra Large</option>
          </select>
   
   {/* Font Family Dropdown */}
   <select
            value={selectedFont}
            onChange={(e) => applyFontFamily(e.target.value)}
            className="p-1.5 rounded cursor-pointer text-gray-500 hover:text-gray-900 dark:hover:text-white dark:bg-navy-700"
          >
            <option value="Arial">Arial</option>
            <option value="Times New Roman">Times New Roman</option>
            <option value="Courier New">Courier New</option>
            <option value="Georgia">Georgia</option>
            <option value="Verdana">Verdana</option>
            <option value="Tahoma">Tahoma</option>
            <option value="Comic Sans MS">Comic Sans MS</option>
          </select>
        </div>
      </div>


      <div
  ref={editorRef}
  contentEditable
  dir="ltr"
  onInput={handleInput}
  onKeyDown={handleKeyDown}
  onClick={handleClickInsideEditor}
  className="p-4 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-600 rounded-b-lg min-h-[200px] prose prose-sm dark:prose-invert"
  style={{ direction: 'ltr', textAlign: 'left' }}
/>



    </div>
  );
};

export default TextEditor;








