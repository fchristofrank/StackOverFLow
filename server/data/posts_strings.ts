export const Q1_DESC = 'Programmatically navigate using React router';
export const Q1_TXT =
  'the alert shows the proper index for the li clicked, and when I alert the variable within the last function Im calling, moveToNextImage(stepClicked), the same value shows but the animation isnt happening. This works many other ways, but Im trying to pass the index value of the list item clicked to use for the math to calculate.';

export const Q2_DESC =
  'android studio save string shared preference, start activity and load the saved string';
export const Q2_TXT =
  'I am using bottom navigation view but am using custom navigation, so my fragments are not recreated every time i switch to a different view. I just hide/show my fragments depending on the icon selected. The problem i am facing is that whenever a config change happens (dark/light theme), my app crashes. I have 2 fragments in this activity and the below code is what i am using to refrain them from being recreated.';

export const Q3_DESC = 'Object storage for a web application';
export const Q3_TXT =
  'I am currently working on a website where, roughly 40 million documents and images should be served to its users. I need suggestions on which method is the most suitable for storing content with subject to these requirements.';

export const Q4_DESC = 'Quick question about storage on android';
export const Q4_TXT =
  'I would like to know the best way to go about storing an array on an android phone so that even when the app/activity ended the data remains';

export const A1_TXT =
  "React Router is mostly a wrapper around the history library. history handles interaction with the browser's window.history for you with its browser and hash histories. It also provides a memory history which is useful for environments that don't have a global history. This is particularly useful in mobile app development (react-native) and unit testing with Node.";
export const A2_TXT =
  "On my end, I like to have a single history object that I can carry even outside components. I like to have a single history.js file that I import on demand, and just manipulate it. You just have to change BrowserRouter to Router, and specify the history prop. This doesn't change anything for you, except that you have your own history object that you can manipulate as you want. You need to install history, the library used by react-router.";
export const A3_TXT =
  'Consider using apply() instead; commit writes its data to persistent storage immediately, whereas apply will handle it in the background.';
export const A4_TXT =
  'YourPreference yourPrefrence = YourPreference.getInstance(context); yourPreference.saveData(YOUR_KEY,YOUR_VALUE);';
export const A5_TXT = 'I just found all the above examples just too confusing, so I wrote my own.';
export const A6_TXT = 'Storing content as BLOBs in databases.';
export const A7_TXT = 'Using GridFS to chunk and store content.';
export const A8_TXT = 'Store data in a SQLLite database.';

export const T1_NAME = 'react';
export const T1_DESC =
  'React is a JavaScript-based UI development library. Although React is a library rather than a language, it is widely used in web development. The library first appeared in May 2013 and is now one of the most commonly used frontend libraries for web development.';

export const T2_NAME = 'javascript';
export const T2_DESC =
  'JavaScript is a versatile programming language primarily used in web development to create interactive effects within web browsers. It was initially developed by Netscape as a means to add dynamic and interactive elements to websites.';

export const T3_NAME = 'android-studio';
export const T3_DESC =
  "Android Studio is the official Integrated Development Environment (IDE) for Google's Android operating system. It is built on JetBrains' IntelliJ IDEA software and is specifically designed for Android development.";

export const T4_NAME = 'shared-preferences';
export const T4_DESC =
  'SharedPreferences is an Android API that allows for simple data storage in the form of key-value pairs. It is commonly used for storing user settings, configuration, and other small pieces of data.';

export const T5_NAME = 'storage';
export const T5_DESC =
  'Storage refers to the various methods and technologies used to store digital data. This can include local storage, cloud storage, databases, file systems, and more, depending on the context.';

export const T6_NAME = 'website';
export const T6_DESC =
  'A website is a collection of interlinked web pages, typically identified with a common domain name, and published on at least one web server. Websites can serve various purposes, such as information sharing, entertainment, commerce, and social networking.';
