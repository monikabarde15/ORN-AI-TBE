import {
    Bookmark,
    FileText,
    MessageSquareText,
} from "lucide-react";

const VideoActions = () => {
    return (<div className="hidden lg:flex items-center gap-2"> <button
        className="
       flex items-center gap-1.5
       px-2 py-1
       rounded-md
       text-white/80
       hover:text-white
       hover:bg-white/10
       transition-colors
     "
    > <Bookmark className="w-4 h-4" /> <span className="text-xs">
            Save </span> </button>


        <button
            className="
      flex items-center gap-1.5
      px-2 py-1
      rounded-md
      text-white/80
      hover:text-white
      hover:bg-white/10
      transition-colors
    "
        >
            <FileText className="w-4 h-4" />
            <span className="text-xs">
                Notes
            </span>
        </button>

        <button
            className="
      flex items-center gap-1.5
      px-2 py-1
      rounded-md
      text-white/80
      hover:text-white
      hover:bg-white/10
      transition-colors
    "
        >
            <MessageSquareText className="w-4 h-4" />
            <span className="text-xs">
                Transcript
            </span>
        </button>
    </div>


    );
};

export default VideoActions;
