const { DateTime } = luxon;

// Curated list of ~50 most common timezones with proper geographic distribution
const timezones = [
    // Americas - covering all major time zones
    { value: 'Pacific/Honolulu', label: 'Honolulu', offset: -10 },
    { value: 'America/Anchorage', label: 'Alaska', offset: -9 },
    { value: 'America/Los_Angeles', label: 'Los Angeles (PST)', offset: -8 },
    { value: 'America/Vancouver', label: 'Vancouver', offset: -8 },
    { value: 'America/Phoenix', label: 'Phoenix (Arizona - no DST)', offset: -7 },
    { value: 'America/Denver', label: 'Denver (MST)', offset: -7 },
    { value: 'America/Mexico_City', label: 'Mexico City', offset: -6 },
    { value: 'America/Chicago', label: 'Chicago (CST)', offset: -6 },
    { value: 'America/Regina', label: 'Saskatchewan (no DST)', offset: -6 },
    { value: 'America/New_York', label: 'New York (EST)', offset: -5 },
    { value: 'America/Toronto', label: 'Toronto', offset: -5 },
    { value: 'America/Bogota', label: 'Bogotá', offset: -5 },
    { value: 'America/Caracas', label: 'Caracas', offset: -4 },
    { value: 'America/Halifax', label: 'Halifax (AST)', offset: -4 },
    { value: 'America/Santiago', label: 'Santiago', offset: -3 },
    { value: 'America/Sao_Paulo', label: 'São Paulo', offset: -3 },
    { value: 'America/Buenos_Aires', label: 'Buenos Aires', offset: -3 },
    { value: 'America/St_Johns', label: 'Newfoundland', offset: -3.5 },

    // Europe - at least 3-5 major cities
    { value: 'Atlantic/Reykjavik', label: 'Reykjavik', offset: 0 },
    { value: 'Europe/London', label: 'London', offset: 0 },
    { value: 'Europe/Dublin', label: 'Dublin', offset: 0 },
    { value: 'Europe/Lisbon', label: 'Lisbon', offset: 0 },
    { value: 'Europe/Paris', label: 'Paris', offset: 1 },
    { value: 'Europe/Berlin', label: 'Berlin', offset: 1 },
    { value: 'Europe/Amsterdam', label: 'Amsterdam', offset: 1 },
    { value: 'Europe/Rome', label: 'Rome', offset: 1 },
    { value: 'Europe/Madrid', label: 'Madrid', offset: 1 },
    { value: 'Europe/Stockholm', label: 'Stockholm', offset: 1 },
    { value: 'Europe/Warsaw', label: 'Warsaw', offset: 1 },
    { value: 'Europe/Athens', label: 'Athens', offset: 2 },
    { value: 'Europe/Istanbul', label: 'Istanbul', offset: 3 },
    { value: 'Europe/Moscow', label: 'Moscow', offset: 3 },

    // Africa - at least 3 major cities
    { value: 'Africa/Casablanca', label: 'Casablanca', offset: 0 },
    { value: 'Africa/Lagos', label: 'Lagos', offset: 1 },
    { value: 'Africa/Cairo', label: 'Cairo', offset: 2 },
    { value: 'Africa/Johannesburg', label: 'Johannesburg', offset: 2 },
    { value: 'Africa/Nairobi', label: 'Nairobi', offset: 3 },

    // Middle East & Asia
    { value: 'Asia/Dubai', label: 'Dubai', offset: 4 },
    { value: 'Asia/Tehran', label: 'Tehran', offset: 3.5 },
    { value: 'Asia/Karachi', label: 'Karachi', offset: 5 },
    { value: 'Asia/Kolkata', label: 'New Delhi/Kolkata', offset: 5.5 },
    { value: 'Asia/Dhaka', label: 'Dhaka', offset: 6 },
    { value: 'Asia/Bangkok', label: 'Bangkok', offset: 7 },
    { value: 'Asia/Jakarta', label: 'Jakarta', offset: 7 },
    { value: 'Asia/Singapore', label: 'Singapore', offset: 8 },
    { value: 'Asia/Hong_Kong', label: 'Hong Kong', offset: 8 },
    { value: 'Asia/Shanghai', label: 'Beijing/Shanghai', offset: 8 },
    { value: 'Asia/Tokyo', label: 'Tokyo', offset: 9 },
    { value: 'Asia/Seoul', label: 'Seoul', offset: 9 },

    // Oceania
    { value: 'Australia/Perth', label: 'Perth', offset: 8 },
    { value: 'Australia/Adelaide', label: 'Adelaide', offset: 9.5 },
    { value: 'Australia/Brisbane', label: 'Brisbane', offset: 10 },
    { value: 'Australia/Sydney', label: 'Sydney/Melbourne', offset: 10 },
    { value: 'Pacific/Auckland', label: 'Auckland', offset: 12 },

    // UTC
    { value: 'UTC', label: 'UTC', offset: 0 }
];

// Store last valid DateTime for time adjustments
let lastValidDateTime = null;

// Initialize the application
function init() {
    populateTimezones();
    setupEventListeners();
    loadFromUrlParams();
}

// Populate timezone select with UTC offsets
function populateTimezones() {
    const select = document.getElementById('timezoneSelect');

    // Sort by UTC offset
    timezones.sort((a, b) => a.offset - b.offset);

    timezones.forEach(tz => {
        const option = document.createElement('option');
        option.value = tz.value;

        // Format offset
        const offsetHours = Math.floor(Math.abs(tz.offset));
        const offsetMinutes = Math.round((Math.abs(tz.offset) % 1) * 60);
        const offsetSign = tz.offset >= 0 ? '+' : '-';
        let offsetStr = `UTC${offsetSign}${offsetHours}`;
        if (offsetMinutes > 0) {
            offsetStr += `:${offsetMinutes.toString().padStart(2, '0')}`;
        }

        option.textContent = `(${offsetStr}) ${tz.label}`;
        select.appendChild(option);
    });
}

// Get current locale and timezone settings
function getSelectedLocale() {
    return document.getElementById('localeSelect').value;
}

function getSelectedTimezone() {
    const tz = document.getElementById('timezoneSelect').value;
    return tz === 'local' ? DateTime.local().zoneName : tz;
}

// Format date with locale awareness
function formatWithLocale(dt, format) {
    const locale = getSelectedLocale();
    const timezone = getSelectedTimezone();
    const dtInZone = dt.setZone(timezone);

    if (format === 'human') {
        // Locale-specific human readable format
        return dtInZone.setLocale(locale).toLocaleString(DateTime.DATETIME_FULL);
    } else if (format === 'date') {
        return dtInZone.setLocale(locale).toLocaleString(DateTime.DATE_FULL);
    } else if (format === 'time') {
        return dtInZone.setLocale(locale).toLocaleString(DateTime.TIME_WITH_SECONDS);
    } else if (format === 'relative') {
        // Add relative time display
        return dtInZone.toRelative({ locale });
    }
    return dtInZone.toISO();
}

// Update outputs when locale or timezone changes
function updateAllOutputs() {
    const unixInput = document.getElementById('unixInput');
    const dateInput = document.getElementById('dateInput');

    if (unixInput.value) {
        unixInput.dispatchEvent(new Event('input'));
    }
    if (dateInput.value) {
        dateInput.dispatchEvent(new Event('input'));
    }
}

// Convert Unix timestamp to date formats
function handleUnixToDate(input) {
    if (!input) {
        document.getElementById('dateOutputs').classList.add('hidden');
        document.getElementById('timeAdjustButtons1').classList.add('hidden');
        return;
    }

    let dt;

    // Check if input contains a decimal point (seconds.milliseconds format)
    if (input.includes('.')) {
        const timestamp = parseFloat(input);
        if (isNaN(timestamp)) {
            document.getElementById('dateOutputs').classList.add('hidden');
            document.getElementById('timeAdjustButtons1').classList.add('hidden');
            return;
        }
        // Convert seconds.milliseconds to DateTime
        dt = DateTime.fromSeconds(timestamp);
    } else {
        // Integer timestamp
        const timestamp = parseInt(input);
        if (isNaN(timestamp)) {
            document.getElementById('dateOutputs').classList.add('hidden');
            document.getElementById('timeAdjustButtons1').classList.add('hidden');
            return;
        }

        // Auto-detect timestamp precision
        if (timestamp.toString().length <= 10) {
            // Seconds
            dt = DateTime.fromSeconds(timestamp);
        } else if (timestamp.toString().length <= 13) {
            // Milliseconds
            dt = DateTime.fromMillis(timestamp);
        } else {
            // Microseconds
            dt = DateTime.fromMillis(Math.floor(timestamp / 1000));
        }
    }

    if (!dt.isValid) {
        document.getElementById('dateOutputs').classList.add('hidden');
        document.getElementById('timeAdjustButtons1').classList.add('hidden');
        return;
    }

    // Store for time adjustments
    lastValidDateTime = dt;

    // Set all the different formats
    const timezone = getSelectedTimezone();

    document.getElementById('isoUtc').textContent = dt.toUTC().toISO();
    document.getElementById('isoLocal').textContent = dt.setZone(timezone).toISO();
    document.getElementById('humanReadable').textContent = formatWithLocale(dt, 'human');
    document.getElementById('rfc822').textContent = dt.setZone(timezone).toRFC2822();
    document.getElementById('rfc2822Cookie').textContent = dt.setZone(timezone).toFormat('EEEE, dd-MMM-yy HH:mm:ss ZZZ');
    document.getElementById('rfc3339').textContent = dt.setZone(timezone).toISO();

    // Add relative time display
    const relativeRow = document.getElementById('relativeTime');
    if (relativeRow) {
        relativeRow.textContent = formatWithLocale(dt, 'relative');
    }

    document.getElementById('dateOutputs').classList.remove('hidden');
    document.getElementById('timeAdjustButtons1').classList.remove('hidden');

    // Update URL with timestamp
    updateUrlParam('unix', input);
}

// Convert date to Unix timestamp formats
function handleDateToUnix(input) {
    if (!input) {
        document.getElementById('unixOutputs').classList.add('hidden');
        document.getElementById('timeAdjustButtons2').classList.add('hidden');
        return;
    }

    let dt = null;

    // Try various parsing strategies
    const parseStrategies = [
        // ISO 8601
        () => DateTime.fromISO(input),
        // RFC 2822
        () => DateTime.fromRFC2822(input),
        // SQL
        () => DateTime.fromSQL(input),
        // HTTP (RFC 1123)
        () => DateTime.fromHTTP(input),
        // Common US format
        () => DateTime.fromFormat(input, 'MM/dd/yyyy'),
        () => DateTime.fromFormat(input, 'MM/dd/yyyy HH:mm:ss'),
        () => DateTime.fromFormat(input, 'MM/dd/yyyy h:mm:ss a'),
        // European format
        () => DateTime.fromFormat(input, 'dd/MM/yyyy'),
        () => DateTime.fromFormat(input, 'dd/MM/yyyy HH:mm:ss'),
        // Other common formats
        () => DateTime.fromFormat(input, 'yyyy-MM-dd'),
        () => DateTime.fromFormat(input, 'yyyy-MM-dd HH:mm:ss'),
        () => DateTime.fromFormat(input, 'dd-MM-yyyy'),
        () => DateTime.fromFormat(input, 'dd-MM-yyyy HH:mm:ss'),
        // JS Date string
        () => DateTime.fromJSDate(new Date(input)),
    ];

    for (const strategy of parseStrategies) {
        try {
            const parsed = strategy();
            if (parsed && parsed.isValid) {
                dt = parsed;
                break;
            }
        } catch (e) {
            // Continue to next strategy
        }
    }

    if (!dt || !dt.isValid) {
        document.getElementById('unixOutputs').classList.add('hidden');
        document.getElementById('timeAdjustButtons2').classList.add('hidden');
        return;
    }

    // Store for time adjustments
    lastValidDateTime = dt;

    const seconds = Math.floor(dt.toSeconds());
    const millis = dt.toMillis();
    const micros = millis * 1000;
    const decimalFormat = dt.toSeconds().toFixed(3);

    document.getElementById('unixSeconds').textContent = seconds.toString();
    document.getElementById('unixDecimal').textContent = decimalFormat;
    document.getElementById('unixMillis').textContent = millis.toString();
    document.getElementById('unixMicros').textContent = micros.toString();

    document.getElementById('unixOutputs').classList.remove('hidden');
    document.getElementById('timeAdjustButtons2').classList.remove('hidden');

    // Update URL with date
    updateUrlParam('date', input);
}

// Handle time adjustments
function adjustTime(unit, amount, targetInput) {
    if (!lastValidDateTime || !lastValidDateTime.isValid) return;

    const adjusted = lastValidDateTime.plus({ [unit]: amount });
    lastValidDateTime = adjusted;

    if (targetInput === 'unix') {
        const unixInput = document.getElementById('unixInput');
        const currentValue = unixInput.value.trim();

        if (currentValue.includes('.')) {
            unixInput.value = adjusted.toSeconds().toFixed(3);
        } else {
            const timestamp = parseInt(currentValue);
            if (timestamp.toString().length <= 10) {
                unixInput.value = Math.floor(adjusted.toSeconds()).toString();
            } else if (timestamp.toString().length <= 13) {
                unixInput.value = adjusted.toMillis().toString();
            } else {
                unixInput.value = (adjusted.toMillis() * 1000).toString();
            }
        }
        unixInput.dispatchEvent(new Event('input'));
    } else if (targetInput === 'date') {
        const dateInput = document.getElementById('dateInput');
        dateInput.value = adjusted.toISO();
        dateInput.dispatchEvent(new Event('input'));
    }
}

// Setup copy functionality with improved animation
function setupCopyFunctionality() {
    const tooltip = document.getElementById('tooltip');
    const copiedTooltip = document.getElementById('copiedTooltip');

    document.addEventListener('click', async function(e) {
        if (e.target.classList.contains('copyable')) {
            const text = e.target.textContent;
            try {
                await navigator.clipboard.writeText(text);

                // Remove text selection
                window.getSelection().removeAllRanges();

                // Add copy animation
                e.target.classList.add('copied');
                setTimeout(() => {
                    e.target.classList.remove('copied');
                }, 600);

                // Show copied tooltip
                copiedTooltip.style.left = e.pageX + 'px';
                copiedTooltip.style.top = (e.pageY - 30) + 'px';
                copiedTooltip.classList.remove('hidden');

                setTimeout(() => {
                    copiedTooltip.classList.add('hidden');
                }, 1500);
            } catch (err) {
                console.error('Failed to copy:', err);
            }
        }
    });

    document.addEventListener('mouseover', function(e) {
        if (e.target.classList.contains('copyable')) {
            tooltip.style.left = e.pageX + 'px';
            tooltip.style.top = (e.pageY - 30) + 'px';
            tooltip.classList.remove('hidden');
        }
    });

    document.addEventListener('mouseout', function(e) {
        if (e.target.classList.contains('copyable')) {
            tooltip.classList.add('hidden');
        }
    });
}


// URL parameter support for sharing
function updateUrlParam(key, value) {
    const url = new URL(window.location);
    if (value) {
        url.searchParams.set(key, value);
    } else {
        url.searchParams.delete(key);
    }
    window.history.replaceState({}, '', url);
}

function loadFromUrlParams() {
    const params = new URLSearchParams(window.location.search);
    const unixParam = params.get('unix');
    const dateParam = params.get('date');

    if (unixParam) {
        document.getElementById('unixInput').value = unixParam;
        document.getElementById('unixInput').dispatchEvent(new Event('input'));
    } else if (dateParam) {
        document.getElementById('dateInput').value = dateParam;
        document.getElementById('dateInput').dispatchEvent(new Event('input'));
    }
}

// Setup all event listeners
function setupEventListeners() {
    // Locale and timezone changes
    document.getElementById('localeSelect').addEventListener('change', updateAllOutputs);
    document.getElementById('timezoneSelect').addEventListener('change', updateAllOutputs);

    // Unix to Date conversion
    document.getElementById('unixInput').addEventListener('input', function(e) {
        handleUnixToDate(e.target.value.trim());
    });

    // Date to Unix conversion
    document.getElementById('dateInput').addEventListener('input', function(e) {
        handleDateToUnix(e.target.value.trim());
    });

    // Current date button
    document.getElementById('currentDateBtn').addEventListener('click', function() {
        const now = DateTime.now();

        // Fill Unix timestamp input (in milliseconds)
        const unixInput = document.getElementById('unixInput');
        unixInput.value = now.toMillis().toString();
        unixInput.dispatchEvent(new Event('input'));

        // Fill date input with ISO format
        const dateInput = document.getElementById('dateInput');
        dateInput.value = now.toISO();
        dateInput.dispatchEvent(new Event('input'));
    });

    // Time adjustment buttons
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('time-adjust-btn')) {
            const unit = e.target.dataset.unit;
            const amount = parseInt(e.target.dataset.amount);

            // Check which button group the clicked button belongs to
            const buttonContainer = e.target.closest('[id^="timeAdjustButtons"]');
            
            if (buttonContainer && buttonContainer.id === 'timeAdjustButtons1') {
                // Unix to Date converter buttons
                adjustTime(unit, amount, 'unix');
            } else if (buttonContainer && buttonContainer.id === 'timeAdjustButtons2') {
                // Date to Unix converter buttons
                adjustTime(unit, amount, 'date');
            }
        }
    });

    // Setup copy functionality
    setupCopyFunctionality();
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}