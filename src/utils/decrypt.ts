export function decryptText($text: string): string {
  const a = [];
  for (const text of $text) {
    let $textModified = text.replace("$", "a");
    $textModified = $textModified.replace("€", "b");
    $textModified = $textModified.replace("{", "c");
    $textModified = $textModified.replace("}", "d");
    $textModified = $textModified.replace("&", "e");
    $textModified = $textModified.replace("*", "f");
    $textModified = $textModified.replace("^", "g");
    $textModified = $textModified.replace("=", "h");
    $textModified = $textModified.replace("@", "t");
    $textModified = $textModified.replace("!", "u");
    $textModified = $textModified.replace("£", "v");
    $textModified = $textModified.replace("#", "s");
    $textModified = $textModified.replace("%", "m");
    $textModified = $textModified.replace("~", "n");
    a.push($textModified);
  }

  return a.join("");
}
