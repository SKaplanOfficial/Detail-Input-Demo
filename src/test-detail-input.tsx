import { Detail, environment, useNavigation } from "@raycast/api";
import { useEffect, useState } from "react";
import { execScript } from "./utils";
import path from "path";

export default function Command() {
  const [content, setContent] = useState<string>("");
  const { push } = useNavigation();

  useEffect(() => {
    const scriptPath = path.resolve(environment.assetsPath, "KeyInput.js");
    execScript(scriptPath, [], "JavaScript", (output) => {
      setContent(output);
    });
  }, []);

  return <Detail markdown={content} />;
}
