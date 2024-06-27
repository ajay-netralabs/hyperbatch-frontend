import { Editor } from "react-draft-wysiwyg";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";

interface props {
    // editorState : any,
    // setEditorState : any
    editorState: any,
    setEditorState: any,
    styleClasses? : string,
    containerClasses?: string,
    editorStyle?: any,
}



export const TextEditor = ({editorState, setEditorState, styleClasses, containerClasses, editorStyle}: props) => {    
    return <Editor editorStyle={editorStyle} wrapperClassName={containerClasses} toolbarHidden editorState={editorState} onEditorStateChange={setEditorState} editorClassName={`border rounded-md p-3 bg-base-100 ${styleClasses}`}/>;
}