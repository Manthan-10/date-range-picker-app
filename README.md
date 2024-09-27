# Date Range Picker

This app is simple React component that allows users to select weekdays (Monday through Friday) and prevents them from selecting weekends (Saturday and
Sunday). 

The component has the following features:
● The component allows users to select a date range defined by a start date and an end date. The start date and an end date will always be 
  a  weekday and will never be a weekend.
  ![Date Range Picker](/public/image1.png)
● The selected date range highlights only weekdays and weekends are not highlighted.
  ![Highlights only weekdays](/public/image2.png)
● The user will be able to change the year displayed in the date picker.
  ![Year Change](/public/image3.png)
● The user will be able to change the month displayed in the date picker.
  ![Month Change](/public/image4.png)
● The component includes a change handler that returns the selected date range and any weekend dates within that range. As an example, 
  if the range selected is December 1st, 2022, to December 15th, 2022, the returned values should be an array containing the date range as the first element (e.g. [2022-12-01, 2022-12-15]) and an array of weekend dates within that range as the second element (e.g. [2022-12-03,
  2022-12-04, 2022-12-10, 2022-12-11]).
  ![Example](/public/image5.png)
● The component includes a prop that allows the user to input predefined ranges, such as the last 7 days or last 30 days. 
  These predefined ranges are displayed below the calendars.
  ![Predefined 7 days](/public/image6.png)
  ![Predefined 30 days](/public/image7.png)