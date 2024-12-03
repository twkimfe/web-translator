// src/components/Translation/TranslationCard.js
import { Card, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import { Loader2 } from "lucide-react";
import useTranslation from "../../hooks/useTranslation";
import useSpeech from "../../hooks/useSpeech";
import TextInput from "./TextInput";
import TranslationOutput from "./TranslationOutput";

const TranslationCard = () => {
  const {
    text,
    translatedText,
    isLoading,
    error,
    handleTextChange,
    translate,
  } = useTranslation();

  const { isListening, speechError, startListening, speak } = useSpeech();

  const handleStartListening = () => {
    startListening((transcript) => {
      handleTextChange(transcript);
    });
  };

  return (
    <Card className="w-full max-w-2xl mx-auto mt-8">
      <CardContent className="p-6">
        <div className="space-y-4">
          <TextInput
            text={text}
            onTextChange={handleTextChange}
            isListening={isListening}
            onStartListening={handleStartListening}
            onSpeak={speak}
            disabled={isLoading}
          />

          <Button
            className="w-full"
            onClick={translate}
            disabled={!text || isLoading}
          >
            {isLoading && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
            번역하기
          </Button>

          <TranslationOutput
            translatedText={translatedText}
            onSpeak={speak}
            disabled={isLoading}
          />

          {(error || speechError) && (
            <div className="text-sm text-red-500">{error || speechError}</div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default TranslationCard;
