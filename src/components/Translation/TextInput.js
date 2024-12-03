// src/components/Translation/TextInput.js
import React from "react";
import { Button } from "../ui/button";
import { Mic, Volume2, Loader2 } from "lucide-react";

const TextInput = ({
  text,
  onTextChange,
  isListening,
  onStartListening,
  onSpeak,
  disabled,
}) => {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">한국어</h3>
        <Button
          variant="outline"
          size="icon"
          onClick={onStartListening}
          disabled={disabled || isListening}
        >
          {isListening ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Mic className="h-4 w-4" />
          )}
        </Button>
      </div>
      <textarea
        value={text}
        onChange={(e) => onTextChange(e.target.value)}
        className="w-full h-32 p-2 border rounded-md"
        placeholder="번역할 텍스트를 입력하거나 마이크 버튼을 눌러 음성으로 입력하세요"
        disabled={disabled}
      />
      <Button
        variant="outline"
        size="icon"
        onClick={() => onSpeak(text, "ko-KR")}
        disabled={disabled || !text}
      >
        <Volume2 className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default TextInput;
