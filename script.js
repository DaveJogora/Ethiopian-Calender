document.addEventListener('DOMContentLoaded', function() {
    const oneHour = 60 * 60 * 1000;
    const oneDay = 24 * oneHour;
    const oneYear = 365 * oneDay;
    const oneLeapYear = 366 * oneDay;
    const fourYears = 3 * oneYear + oneLeapYear;
    const globalTimeDifference = new Date('December 9, 2012').getTime() - new Date('April 1, 2005').getTime();

    const calendarDays = document.getElementById('calendarDays');
    const monthYear = document.getElementById('monthYear');
    const prevMonthButton = document.getElementById('prevMonth');
    const nextMonthButton = document.getElementById('nextMonth');
    const timeInput = document.getElementById('time');
    const selectedDateTimeDisplay = document.getElementById('selectedDateTime');
    const monthYearSelector = document.getElementById('monthYearSelector');
    const yearInput = document.getElementById('yearInput');

    let currentDate = new Date();
    let selectedDate = null;
    let ethiopianDate = toEthiopianDateTime(currentDate);
    let selectedMonth = ethiopianDate.month - 1;
    let selectedYear = ethiopianDate.year;

    yearInput.addEventListener('input', setYear);

    function setYear() {
        const year = parseInt(yearInput.value, 10);
        if (!isNaN(year)) {
            selectedYear = year;
            renderCalendar(selectedYear, selectedMonth);
        }
    }

    const ethiopianMonths = [
        'መስከረም', 'ጥቅምት', 'ህዳር', 'ታህሳስ', 'ጥር', 'የካቲት',
        'መጋቢት', 'ሚያዝያ', 'ግንቦት', 'ሰኔ', 'ሐምሌ', 'ነሐሴ', 'ጳጉሜ'
    ];

    const ethiopianDays = [
         'ሰኞ', 'ማክሰኞ', 'ረቡዕ', 'ሐሙስ', 'አርብ', 'ቅዳሜ','እሁድ'
    ];

    renderCalendar(selectedYear, selectedMonth);

    prevMonthButton.addEventListener('click', function() {
        if (selectedMonth === 0) {
            selectedMonth = 12;
            selectedYear--;
        } else {
            selectedMonth--;
        }
        renderCalendar(selectedYear, selectedMonth);
    });

    nextMonthButton.addEventListener('click', function() {
        if (selectedMonth === 12) {
            selectedMonth = 0;
            selectedYear++;
        } else {
            selectedMonth++;
        }
        renderCalendar(selectedYear, selectedMonth);
    });

    timeInput.addEventListener('input', updateSelectedDateTime);

    function renderCalendar(year, month) {
        calendarDays.innerHTML = ''; // Clear previous content
        monthYear.textContent = `${ethiopianMonths[month]} ${year}`;
        const daysInMonth = getDaysInMonth(year, month);

        let dateCounter = 1;
        for (let i = 0; i < 6; i++) {
            const row = document.createElement('tr');
            for (let j = 0; j < 7; j++) {
                const cell = document.createElement('td');
                if (i === 0 && j < getFirstDayOfMonth(year, month) || dateCounter > daysInMonth) {
                    cell.textContent = '';
                } else {
                    cell.textContent = dateCounter;
                    if (isToday(year, month, dateCounter)) {
                        cell.classList.add('today');
                    }
                    cell.addEventListener('click', function() {
                        selectDate(year, month, dateCounter);
                    });
                    dateCounter++;
                }
                row.appendChild(cell);
            }
            calendarDays.appendChild(row);
        }
    }


//==================================

// Add event listener to monthYear for opening month selector
monthYear.addEventListener('click', openMonthYearSelector);

// Updated openMonthYearSelector function
function openMonthYearSelector() {
    monthYearSelector.style.display = 'block';
    renderMonthSelector();
}

// Updated renderMonthSelector function
function renderMonthSelector() {
    const monthsDiv = document.querySelector('.months');
    monthsDiv.innerHTML = ''; // Clear previous content
    ethiopianMonths.forEach((month, index) => {
        const monthDiv = document.createElement('div');
        monthDiv.textContent = month;
        monthDiv.addEventListener('click', function() {
            selectedMonth = index;
            renderCalendar(selectedYear, selectedMonth);
            closeMonthYearSelector();
        });
        monthsDiv.appendChild(monthDiv);
    });
}


//=========================================




    function getDaysInMonth(year, month) {
        if (month === 12) {
            return isLeapYear(year) ? 6 : 5;
        }
        return 30;
    }

    function getFirstDayOfMonth(year, month) {
        // Placeholder logic; should be replaced with accurate Ethiopian first day logic
        return (new Date(toEuropeanDate({ year, month: month + 1, date: 1 })).getDay() + 6) % 7;
    }

    function isLeapYear(year) {
        return (year % 4 === 3);
    }

    function isToday(year, month, day) {
        const today = new Date();
        const ethiopianToday = toEthiopianDateTime(today);
        return ethiopianToday.year === year && ethiopianToday.month - 1 === month && ethiopianToday.date === day;
    }

    function selectDate(year, month, day) {
        selectedDate = toEuropeanDate(new ethDateTime(day, month + 1, year, 0, 0, 0));
        updateSelectedDateTime();
    }

    function updateSelectedDateTime() {
        if (selectedDate) {
            const time = timeInput.value;
            const dateStr = selectedDate.toLocaleDateString();
            selectedDateTimeDisplay.textContent = `Selected Date and Time: ${dateStr} ${time}`;
        }
    }

    function openMonthYearSelector() {
        monthYearSelector.style.display = 'block';
        renderMonthSelector();
    }

    function closeMonthYearSelector() {
        monthYearSelector.style.display = 'none';
    }

    

    function renderMonthSelector() {
        const monthsDiv = document.querySelector('.months');
        monthsDiv.innerHTML = ''; // Clear previous content
        ethiopianMonths.forEach((month, index) => {
            const monthDiv = document.createElement('div');
            monthDiv.textContent = month;
            monthDiv.addEventListener('click', function() {
                selectedMonth = index;
                renderCalendar(selectedYear, selectedMonth);
                closeMonthYearSelector();
            });
            monthsDiv.appendChild(monthDiv);
        });
    }

    // Utility function to convert Gregorian date to Ethiopian date
    function toEthiopianDateTime(eurDate) {
        if (!eurDateIsConvertible(eurDate)) return false;
        var difference = eurDate.getTime() - new Date(Date.UTC(1971, 8, 12)).getTime();
        var fourYearsPassed = Math.floor(difference / fourYears);
        var remainingYears = Math.floor((difference - fourYearsPassed * fourYears) / oneYear);
        if (remainingYears === 4) {
            remainingYears = 3;
        }
        var remainingMonths = Math.floor((difference - fourYearsPassed * fourYears - remainingYears * oneYear) / (30 * oneDay));
        var remainingDays = Math.floor((difference - fourYearsPassed * fourYears - remainingYears * oneYear - remainingMonths * 30 * oneDay) / oneDay);
        var remainingHours = eurDate.getHours();
        if (remainingHours < 0) {
            remainingHours += 24;
        }
        var ethDate = new ethDateTime(remainingDays + 1, remainingMonths + 1, remainingYears + 4 * fourYearsPassed + 1964, remainingHours, eurDate.getMinutes(), eurDate.getSeconds());
        return ethDate;
    }

    // Function to convert Ethiopian date to Gregorian date
    function toEuropeanDate(ethDate) {
        var initialEuropean = new Date(new Date(Date.UTC(ethDate.year, ethDate.month - 1, ethDate.date)).getTime() + globalTimeDifference);
        if (ethDate.month === 13) {
            var maxDate;
            if (ethDate.year % 4 === 3)
                maxDate = 6;
            else
                maxDate = 5;
            if (ethDate.date > maxDate) {
                const errMsg = 'Pagume Only has ' + maxDate + ' days at year ' + ethDate.year + '. Please select another day.';
                return errMsg;
            }
        }
        for (var count = -8; count < 9; count++) {
            const eurDate = new Date(initialEuropean.getTime() + count * oneDay);
            var difference = eurDate.getTime() - new Date(Date.UTC(1971, 8, 12)).getTime();
            var fourYearsPassed = Math.floor(difference / fourYears);
            var remainingYears = Math.floor((difference - fourYearsPassed * fourYears) / oneYear);
            if (remainingYears === 4) {
                remainingYears = 3;
            }
            var remainingMonths = Math.floor((difference - fourYearsPassed * fourYears - remainingYears * oneYear) / (30 * oneDay));
            var remainingDays = Math.floor((difference - fourYearsPassed * fourYears - remainingYears * oneYear - remainingMonths * 30 * oneDay) / oneDay);
            if (ethDate.date === remainingDays + 1 && ethDate.month === remainingMonths + 1) {
                if (!eurDateIsConvertible(eurDate)) return false;
                return eurDate;
            }
        }
    }

    // Function to get the day of the week string
    function dayOfWeekString(day) {
        const dayOfWeekStrings = {
            0: 'Sunday',
            1: 'Monday',
            2: 'Tuesday',
            3: 'Wednesday',
            4: 'Thursday',
            5: 'Friday',
            6: 'Saturday',
        };
        return dayOfWeekStrings[day];
    }

    // Function to get the month string in Ethiopian
    function monthStringEth(month) {
        const ethMonthStrings = {
            1: 'Meskerem ',
            2: 'Tikimt ',
            3: 'Hidar ',
            4: 'Tahsas ',
            5: 'Tir ',
            6: 'Yekatit ',
            7: 'Megabit ',
            8: 'Miyazya ',
            9: 'Ginbot ',
            10: 'Sene ',
            11: 'Hamle ',
            12: 'Nehase ',
            13: 'Pagume ',
        };
        return ethMonthStrings[month];
    }

    // Class for Ethiopian date time
    function ethDateTime(date, mon, yr, hr, min, sec) {
        if (date <= 30) {
            this.date = date;
        } else {
            throw new Error('Invalid Ethiopian Date');
        }
        if (yr > 200) {
            this.year = yr;
        } else {
            this.year = yr + 1900;
        }
        this.month = mon;
        this.hour = hr;
        this.minute = min;
        this.second = sec;
        this.getDay = ethDayOfWeek;
        this.dateString = monthStringEth(mon) + this.date + ', ' + this.year;
        if (hr < 13) {
            this.timeString = leftpad(hr) + ':' + leftpad(min) + ':' + leftpad(sec) + ' a.m.';
        } else {
            this.timeString = leftpad(hr - 12) + ':' + leftpad(min) + ':' + leftpad(sec) + ' p.m.';
        }
        this.dateWithDayString = dayOfWeekString(this.getDay()) + ', ' + this.dateString;
        this.dateTimeString = this.dateString + ', ' + this.timeString;
        this.fullDateTimeString = this.dateTimeString + ', ' + dayOfWeekString(this.getDay()) + '.';
        function ethDayOfWeek() {
            return (this.year + 2 * this.month + this.date + ethDifference(this.year)) % 7;
            function ethDifference(ethYear) {
                return -(Math.floor((2023 - ethYear) / 4));
            }
        }
    }

    // Function to check if a Gregorian date is convertible to Ethiopian date
    function eurDateIsConvertible(eurDate) {
        const minEurDate = new Date(1900, 2, 1);
        const maxEurDate = new Date(2100, 1, 1);
        return eurDate >= minEurDate && eurDate <= maxEurDate;
    }

    // Function to left pad numbers
    function leftpad(Num, length) {
        length = length || 2;
        return ('000000000' + Num).slice(-length);
    }

    // Function to handle previous month button click
    function prevMonth() {
        if (selectedMonth === 0) {
            selectedMonth = 12;
            selectedYear--;
        } else {
            selectedMonth--;
        }
        renderCalendar(selectedYear, selectedMonth);
    }

    // Function to handle next month button click
    function nextMonth() {
        if (selectedMonth === 12) {
            selectedMonth = 0;
            selectedYear++;
        } else {
            selectedMonth++;
        }
        renderCalendar(selectedYear, selectedMonth);
    }
});
