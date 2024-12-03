// src/components/Translation/TranslationOutput.js
import React from "react";
import { Button } from "../ui/button";
import { Volume2 } from "lucide-react";

const TranslationOutput = ({ translatedText, onSpeak, disabled }) => {
  return (
    <div className="space-y-2">
      <h3 className="text-lg font-medium">중국어</h3>
      <div className="w-full h-32 p-2 border rounded-md bg-gray-50">
        {translatedText}
      </div>
      <Button
        variant="outline"
        size="icon"
        onClick={() => onSpeak(translatedText, "zh-CN")}
        disabled={disabled || !translatedText}
      >
        <Volume2 className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default TranslationOutput;
