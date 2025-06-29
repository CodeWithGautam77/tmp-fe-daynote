import Swal from "sweetalert2";
import { jwtDecode } from "jwt-decode";

export const removeAuthToken = () => {
  localStorage.removeItem("token");
};

export const getAuthToken = () => {
  if (localStorage.getItem("token")) {
    return localStorage.getItem("token");
  } else {
    return null;
  }
};

export const getToken = () => {
  const token = getAuthToken();

  if (!token || token === "") {
    return {
      error: true,
    };
  } else {
    return {
      error: false,
      token,
    };
  }
};

export const SweetAlert = ({ title, text, icon }) => {
  return Swal.fire({
    title: title,
    text: text,
    icon: icon,
  });
};

export const DeleteSweetAlert = ({
  title,
  icon1,
  title2,
  text,
  icon2,
  callApi,
  setOldData,
}) => {
  return Swal.fire({
    title: title,
    text: title2,
    icon: icon1,
    showCancelButton: true,
    confirmButtonColor: "#5D87FF",
    cancelButtonColor: "#d33",
    confirmButtonText: "Yes",
  }).then(async (result) => {
    if (result.isConfirmed) {
      await callApi();
      Swal.fire({
        title: title2,
        text: text,
        icon: icon2,
      });
      if (setOldData) {
        setOldData();
      }
    }
  });
};

export const isTokenExpired = (token) => {
  if (!token) return true;
  try {
    // console.log(token)
    const decodedToken = jwtDecode(token);
    const currentTime = Date.now() / 1000; // current time in seconds
    return decodedToken.exp < currentTime;
  } catch (error) {
    console.error("Invalid token:", error);
    return true;
  }
};

const gujaratiToEnglishNumberMap = {
  "૦": "0",
  "૧": "1",
  "૨": "2",
  "૩": "3",
  "૪": "4",
  "૫": "5",
  "૬": "6",
  "૭": "7",
  "૮": "8",
  "૯": "9",
  s: "5",
  S: "5",
  i: "1",
  I: "1",
  L: "1",
  l: "1",
  o: "0",
  O: "0",
  A: "4",
  G: "6",
  E: "9",
  g: "9",
  "''": "11",
};

export const convertGujaratiToEnglish = (gujaratiNumber) => {
  let englishNumber = "";
  for (const char of gujaratiNumber) {
    englishNumber += gujaratiToEnglishNumberMap[char] || char; // Default to the char itself if it's not a Gujarati digit
  }
  const numericValue = Number(englishNumber.trim().match(/\d+/g)?.join(""));
  const reducedValue = Number((parseFloat(numericValue) * 0.1).toFixed(2)); // 10% of the original value
  return reducedValue;
};

export const phoneConvertGujaratiToEnglish = (gujaratiNumber) => {
  let englishNumber = "";
  for (const char of gujaratiNumber) {
    if (char === ".") {
      englishNumber += ".";
    } else {
      englishNumber += gujaratiToEnglishNumberMap[char] || char;
    }
  }
  return englishNumber
    .trim()
    .match(/[\d.]+/g)
    ?.join("");
};

export const extractWord = (text) => {
  // console.log("text -->", text);
  const wordToFind = ["મેતો", "રજા", "ચુકતે", "ચૂકતે", "નેટ", "દુકાન"];
  const foundWords = [];
  for (const word of wordToFind) {
    // const regex = new RegExp(`\\b${word}\\b`, "u");
    // console.log("regex -->", regex);

    if (text.includes(word)) {
      // console.log("word -->", word);

      foundWords.push(word);
    }
  }

  // Custom logic for returning specific values
  if (foundWords.includes("મેતો") && foundWords.includes("રજા")) {
    return "MR";
  } else if (foundWords.includes("મેતો")) {
    return "M"; // Return the first matched word
  } else if (foundWords.includes("દુકાન")) {
    return "SE"; // Return the first matched word
  } else if (foundWords.includes("ચુકતે") || foundWords.includes("ચૂકતે")) {
    return null; // Return the first matched word
  } else if (foundWords.includes("નેટ")) {
    return null; // Return the first matched word
  }

  return null;
};

export const getEType = (text) => {
  // console.log("text -->", text);
  const wordToFind = [
    // "બેંક",
    // "બેન્ક",
    // "આંગડિયા",
    // "આંગડીયા",
    "મેતો",
    "રજા",
    "ચુકતે",
    "ચૂકતે",
    "નેટ",
    "દુકાન",
  ];
  const foundWords = [];
  for (const word of wordToFind) {
    // const regex = new RegExp(`\\b${word}\\b`, "u");
    // console.log("regex -->", regex);

    if (text.includes(word)) {
      // console.log("word -->", word);

      foundWords.push(word);
    }
  }

  // Custom logic for returning specific values
  if (foundWords.includes("મેતો") && foundWords.includes("રજા")) {
    return "MR";
  }
  //  else if (foundWords.includes("બેંક") || foundWords.includes("બેન્ક")) {
  //   return "B";
  // } else if (foundWords.includes("આંગડિયા") || foundWords.includes("આંગડીયા")) {
  //   return "A";
  // }
  else if (foundWords.includes("મેતો")) {
    return "M"; // Return the first matched word
  } else if (foundWords.includes("દુકાન")) {
    return "SE"; // Return the first matched word
  } else if (foundWords.includes("ચુકતે") || foundWords.includes("ચૂકતે")) {
    return "P"; // Return the first matched word
  } else if (foundWords.includes("નેટ")) {
    return "R"; // Return the first matched word
  }

  return null;
};

export const removeSuffix = (str) => {
  // Define the suffixes to remove
  const suffixes = ["ચુકતે", "નેટ"];

  // Iterate over each suffix and remove it from the string
  suffixes.forEach((suffix) => {
    if (str.startsWith(suffix)) {
      str = str.slice(suffix.length).trim(); // Remove the prefix
    }
    if (str.endsWith(suffix)) {
      str = str.slice(0, -suffix.length).trim(); // Remove the suffix
    }
  });

  return str;
};

export const insertEntryInOrder = (array, data, order) => {
  // Find the insertion index based on order
  if (order && order[0] === "T") {
    array.unshift(data); // Insert at the beginning
    return;
  }

  let insertIndex = array.findIndex((entry) => {
    // Insert before the first empty entry or when the correct order position is found
    if (entry.entName === "" && entry.amount === "") return true;

    // Get the current entry and new entry index from the order array
    const currentIndex = order.indexOf(entry.etype);
    const newEntryIndex = order.indexOf(data.etype);

    // Handle cases where etype might not be in the defined order list
    if (newEntryIndex === -1) return false;

    // Compare indices to maintain order
    return newEntryIndex < currentIndex || currentIndex === -1;
  });

  // If no insertion point is found, add it to the end
  if (insertIndex === -1) {
    array.push(data);
  } else {
    array.splice(insertIndex, 0, data);
  }
};

export const gujaratCities = [
  "આનંદ",
  "આબુરોડ",
  "અમદાવાદ",
  "અકોલા",
  "અંબાજી",
  "આંબલિયાસણ",
  "અંજાર",
  "આશપુર",
  "બારમેર",
  "બાલાસિનોર",
  "બાલોત્રા",
  "બેંગ્લોર",
  "બરોડા",
  "બરવાળા",
  "બાસવડા",
  "બાવલા",
  "બેચરાજી",
  "ભાભર",
  "ભચાઉ",
  "ભારપુરા",
  "ભાવનગર",
  "ભિલોડા",
  "ભુજ",
  "બિચીવાડા",
  "બિકાનેર",
  "બોડેલી",
  "બોટાદ",
  "ચાણસ્મા",
  "છાયા",
  "ચિલોડા",
  "ચિટોડા",
  "ચિત્રી",
  "કોઈમ્બતુર",
  "દાહોદ",
  "ડાકોર",
  "દાતા",
  "ડીસા",
  "દહેગામ",
  "દિલ્હી",
  "ધ્રાંગધ્રા",
  "ધારિયાવદ",
  "ધોળકા",
  "ધોરીમન્ના",
  "દિવ",
  "દિવડાકોલોની",
  "દિયોદર",
  "ડુંગરપુર",
  "ફતેહનગર",
  "ફતેપુરા",
  "ફિરોઝાબાદ",
  "ફુડેડા",
  "ગાંધીનગર",
  "ગંગાનગર",
  "ઘીનોજ",
  "ગોધરા",
  "હાલોલ",
  "હારિજ",
  "હિંમતનગર",
  "હૈદરાબાદ",
  "ઇડર",
  "જબુઆ",
  "જાફરાબાદ",
  "જયપુર",
  "જોધપુર",
  "જૂનાગઢ",
  "કડી",
  "કલોલ",
  "કાંકરોલી",
  "કપડવંજ",
  "કઠલાલ",
  "ખંભાત",
  "ખેડા",
  "ખેરાલુ",
  "ખેરવાડા",
  "કોટડા",
  "કોથનબા",
  "કુકરવાડા",
  "કુશલગઠ",
  "લીમડી",
  "લુણાવાડા",
  "મલેકપુર",
  "માણેકપુર",
  "માંગરોળ",
  "માનસા",
  "મહેમદ્દાબાદ",
  "મહેસાણા",
  "મોડાસા",
  "મોધેરા",
  "મુંબઈ",
  "નડિયાદ",
  "નાગપુર",
  "નખત્રાણા",
  "નાકોડા",
  "નાના ચિલોડા",
  "નવસારી",
  "ઓબરી",
  "ઓસિયા",
  "પાદરા",
  "પાલનપુર",
  "પાલી",
  "પાંડવા",
  "પાટણ",
  "પાટડી",
  "પેથાપુર",
  "પેટલાદ",
  "પોરબંદર",
  "પ્રાંતિજ",
  "પુણે",
  "પુંજપુર",
  "રાધનપુર",
  "રાજકોટ",
  "રામદેવરા",
  "રાપર",
  "રતનપુર",
  "રતલામ",
  "સાબરડેરી",
  "સાગવડા",
  "સહેરા",
  "સલાલ",
  "સેલમ્બર",
  "સનાદ",
  "સાણંદ",
  "સાંચોર",
  "સાતલપુર",
  "સંતરામપુર",
  "સરીગામ",
  "સાથનબા",
  "સાયલા",
  "શિમરવડા",
  "શિવગંજ",
  "શામળાજી",
  "સુખસર",
  "સુરત",
  "સુરેન્દ્રનગર",
  "તલોદ",
  "થાનગઢ",
  "થભોલા",
  "થરા",
  "થરાદ",
  "ટીટોઈ",
  "ઉદયપુર",
  "વડાલી",
  "વડનગર",
  "વડોદરા",
  "વક્તપુર",
  "વલસાડ",
  "વણકબોરી",
  "વનોદ",
  "વાવ",
  "વેરાવળ",
  "વિજાપુર",
  "વિજયનગર",
  "વિરમગામ",
  "વિરપુર",
  "વિસનગર",
  "જામનગર",
  "કોટા",
  "નાગૌર",
  "નાથદ્વારા",
];

const gujaratiToEnglishMap = {
  // Consonants
  ક: "k",
  ખ: "kh",
  ગ: "g",
  ઘ: "gh",
  ચ: "ch",
  છ: "chh",
  જ: "j",
  ઝ: "z",
  ટ: "t",
  ઠ: "th",
  ડ: "d",
  ઢ: "dh",
  ણ: "n",
  ત: "t",
  થ: "th",
  દ: "d",
  ધ: "dh",
  ન: "n",
  પ: "p",
  ફ: "f",
  બ: "b",
  ભ: "bh",
  મ: "m",
  ય: "y",
  ર: "r",
  લ: "l",
  ળ: "l",
  વ: "v",
  શ: "sh",
  ષ: "sh",
  સ: "s",
  હ: "h",

  // Vowels
  અ: "a",
  આ: "aa",
  ઇ: "i",
  ઈ: "i",
  ઉ: "u",
  ઊ: "u",
  એ: "e",
  ઐ: "ai",
  ઓ: "o",
  ઔ: "au",

  // Vowel Signs
  "ા": "a",
  "િ": "i",
  "ી": "i",
  "ુ": "u",
  "ૂ": "u",
  "ે": "e",
  "ૈ": "ai",
  "ો": "o",
  "ૌ": "au",

  // Miscellaneous
  "ઁ": "n",
  "ં": "n",
  "ઃ": "",
  "્": "",
  "ૃ": "ru",
};

const vowelSigns = [
  "ા",
  "િ",
  "ી",
  "ુ",
  "ૂ",
  "ે",
  "ૈ",
  "ો",
  "ૌ",
  "અ",
  "આ",
  "ઇ",
  "ઈ",
  "ઉ",
  "ઊ",
  "એ",
  "ઐ",
  "ઓ",
  "ઔ",
];
const virama = "્";
const miscChars = ["ઁ", "ં", "ઃ"];
const specialChar = "ૃ";

export const textConvertGujaratiToEnglish = (input) => {
  // console.log(input)
  if (input) {
    const words = input.split(" ");

    const result = words
      .map((word) => {
        let wordResult = "";
        let lastMappedChar = ""; // Track the last mapped character for removing "a"

        for (let i = 0; i < word.length; i++) {
          const char = word[i];
          // console.log("char", char);
          const nextChar = word[i + 1];

          if (char === virama) {
            // Skip adding virama to the result
            continue;
          }

          if (char === specialChar) {
            // Handle special character 'ૃ'
            if (lastMappedChar.endsWith("a")) {
              lastMappedChar = lastMappedChar.slice(0, -1); // Remove the trailing "a"
            }
            wordResult = wordResult.slice(0, -lastMappedChar.length); // Remove last character if it had "a"
            wordResult += gujaratiToEnglishMap[char]; // Add "ru" instead of 'ૃ'
            lastMappedChar = gujaratiToEnglishMap[char]; // Update lastMappedChar
          } else if (miscChars.includes(char)) {
            // Do not add "a" if the character is one of the miscellaneous characters
            wordResult += gujaratiToEnglishMap[char] || char;
            lastMappedChar = "";
          } else if (gujaratiToEnglishMap[char]) {
            let mappedChar = gujaratiToEnglishMap[char];

            if (nextChar === virama) {
              // Do not append "a" and remove "a" from the previous character if it exists
              if (lastMappedChar.endsWith("a")) {
                lastMappedChar = lastMappedChar.slice(0, -1); // Remove the trailing "a"
                // mappedChar = mappedChar; // Use mappedChar without "a"
              }
              // wordResult = wordResult.slice(0, -lastMappedChar.length); // Remove last character if it had "a"
              wordResult += mappedChar;
              lastMappedChar = mappedChar; // Update lastMappedChar without "a"
            } else {
              // Append "a" if this character is a consonant and the next character is not a vowel sign
              if (
                i < word.length - 1 && // Not the last character
                !vowelSigns.includes(nextChar) && // Next character is not a vowel sign
                !vowelSigns.includes(char) && // Current character is not a vowel sign
                !miscChars.includes(char) // Current character is not a miscellaneous character
              ) {
                mappedChar += "a";
              }
              wordResult += mappedChar;
              lastMappedChar = mappedChar;
            }
          } else {
            wordResult += char;
            lastMappedChar = "";
          }
        }
        return wordResult;
      })
      .join(" ");

    return result;
  }
};

export const removeEnglishWords = (inputString) => {
  const englishWordRegex = /\b[a-zA-Z0-9]+\b/g;
  return inputString.replace(englishWordRegex, "").trim();
};

export const updateArrConvertToEng = (data) => {
  const updatedData = data.map((item) => {
    if (item.entName && !item.entArea) {
      return { ...item, entName: textConvertGujaratiToEnglish(item.entName) };
    }
    if (item.entName && item.entArea) {
      return {
        ...item,
        entName: textConvertGujaratiToEnglish(item.entName),
        entArea: textConvertGujaratiToEnglish(item.entArea),
      };
    } else {
      return { ...item };
    }
  });
  return updatedData;
};

export const removeWords = (inputString, wordsToRemove) => {
  const wordsArray = inputString.split(" ");
  const filteredWords = wordsArray.filter(
    (word) => !wordsToRemove.includes(word)
  );
  return filteredWords.join(" ");
};

export const updateBorrowArray = (array, emptyObject, data) => {
  const emptyIndex = array.findIndex(
    (item) =>
      item.entName === emptyObject.entName && item.amount === emptyObject.amount
  );

  if (emptyIndex !== -1) {
    // Replace the empty object with the new data
    array[emptyIndex] = data;
  } else {
    // Add the new data to the end of the array
    array.push(data);
  }

  return [...array]; // Return a new array for immutability
};

export const isValidNumber = (value) => {
  return /^-?\d+(\.\d+)?$/.test(value);
};

export function calculatePercentageAmount(amount, percentage) {
  const num = parseFloat(amount);
  if (isNaN(num)) return "0.00";
  return (num * (percentage / 100)).toFixed(2);
}
