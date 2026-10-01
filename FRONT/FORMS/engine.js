(function () {

    "use strict";

    /* =========================================================
       GLOBAL VARIABLES
       ========================================================= */

    var configs = {};
    var active = "sc";

    var modal = null;
    var body = document.body;
    var closeBtn = null;

    var currentValues = {};
    var currentSelections = {};
    var currentPhotoDataUrl = "";
    var currentPhotoName = "";

    /* =========================================================
       REGISTER FORM CONFIGURATION
       ========================================================= */

    function register(cfg) {

        if (cfg && cfg.key) {

            configs[cfg.key] = cfg;

        }

    }


    function cfg() {

        return configs[active] || {};

    }


    function getPhotoBox() {

        var c = cfg() || {};
        var p = c.photo || null;

        if (!p) { return null; }

        var w = Number(p.w) || 0;
        var h = Number(p.h) || 0;

        if (!w || !h) { return null; }

        return {
            x: Number(p.x) || 0,
            y: Number(p.y) || 0,
            w: w,
            h: h
        };

    }


    function hasPhotoBox() { return !!getPhotoBox(); }


    function readPhotoFile(file) {

        if (!file || !(/^image\//).test(file.type || "")) {
            alert("Please choose an image file (JPG or PNG).");
            return;
        }

        if (file.size > 12 * 1024 * 1024) {
            alert("That picture is too large. Please choose a file below 12MB.");
            return;
        }

        var reader = new FileReader();

        reader.onload = function () {
            var raw = String(reader.result || "");
            if (!raw) { return; }
            var img = new Image();
            img.onload = function () {
                try {
                    var maxSide = 900;
                    var iw = img.naturalWidth || 1;
                    var ih = img.naturalHeight || 1;
                    var scale = Math.min(1, maxSide / Math.max(iw, ih));
                    var cw = Math.max(1, Math.round(iw * scale));
                    var ch = Math.max(1, Math.round(ih * scale));
                    var cv = document.createElement("canvas");
                    cv.width = cw;
                    cv.height = ch;
                    var cx = cv.getContext("2d");
                    cx.fillStyle = "#ffffff";
                    cx.fillRect(0, 0, cw, ch);
                    cx.drawImage(img, 0, 0, cw, ch);
                    currentPhotoDataUrl = cv.toDataURL("image/jpeg", 0.85);
                    currentPhotoName = file.name || "photo.jpg";
                    refreshPhotoWidgets();
                } catch (err) {
                    console.error("Photo processing error:", err);
                    alert("That picture could not be read. Please try another file.");
                }
            };
            img.onerror = function () {
                alert("That picture could not be read. Please try another file.");
            };
            img.src = raw;
        };

        reader.onerror = function () {
            alert("That picture could not be read. Please try again.");
        };

        reader.readAsDataURL(file);

    }


    function clearPhoto() {
        currentPhotoDataUrl = "";
        currentPhotoName = "";
        refreshPhotoWidgets();
    }


    function refreshPhotoWidgets() {
        Array.prototype.forEach.call(
            document.querySelectorAll(".form-photo-widget"),
            function (widget) {
                var img = widget.querySelector(".form-photo-preview-img");
                var nm = widget.querySelector(".form-photo-name");
                var empty = widget.querySelector(".form-photo-empty");
                var rm = widget.querySelector("[data-photo-remove]");
                var browse = widget.querySelector("[data-photo-browse]");
                var hasPhoto = !!currentPhotoDataUrl;
                if (img) {
                    if (hasPhoto) { img.src = currentPhotoDataUrl; }
                    img.style.display = hasPhoto ? "block" : "none";
                }
                if (empty) { empty.style.display = hasPhoto ? "none" : "flex"; }
                if (nm) { nm.textContent = hasPhoto ? (currentPhotoName || "Attached photo") : ""; }
                if (browse) { browse.textContent = hasPhoto ? "Replace Photo" : "Upload Photo"; }
                if (rm) { rm.style.display = hasPhoto ? "inline-block" : "none"; }
                widget.classList.toggle("has-photo", hasPhoto);
            }
        );
        Array.prototype.forEach.call(
            document.querySelectorAll('input[data-photo-input="1"]'),
            function (input) {
                if (!currentPhotoDataUrl) {
                    try { input.value = ""; } catch (e) {}
                }
            }
        );
        Array.prototype.forEach.call(
            document.querySelectorAll(".preview-photo-img"),
            function (img) {
                if (currentPhotoDataUrl) {
                    img.src = currentPhotoDataUrl;
                    img.style.display = "block";
                } else {
                    img.removeAttribute("src");
                    img.style.display = "none";
                }
            }
        );
        Array.prototype.forEach.call(
            document.querySelectorAll(".preview-photo-empty"),
            function (empty) {
                empty.style.display = currentPhotoDataUrl ? "none" : "flex";
            }
        );
    }


    function wirePhotoWidget(widget) {
        if (!widget || widget.dataset.photoWired === "1") { return; }
        widget.dataset.photoWired = "1";
        var input = widget.querySelector('input[data-photo-input="1"]');
        var browse = widget.querySelector("[data-photo-browse]");
        var rm = widget.querySelector("[data-photo-remove]");
        var frame = widget.querySelector("[data-photo-frame]");
        if (browse && input) {
            browse.addEventListener("click", function () { input.click(); });
        }
        /* "Attach Recent Photo" box itself uploads — click frame/empty/preview to pick file. */
        if (frame && input) {
            frame.addEventListener("click", function () { input.click(); });
        }
        if (input) {
            input.addEventListener("change", function () {
                var file = (input.files && input.files[0]) || null;
                if (file) { readPhotoFile(file); }
                try { input.value = ""; } catch (e) {}
            });
        }
        if (rm) {
            rm.addEventListener("click", function (e) {
                e.preventDefault();
                e.stopPropagation();
                clearPhoto();
            });
        }
    }


    function photoWidgetHTML(extraClass) {
        var cls = "form-photo-widget" + (extraClass ? " " + extraClass : "");
        return (
            '<div class="' + cls + '">' +
                '<div class="form-photo-frame" data-photo-frame title="Click to upload photo">' +
                    '<div class="form-photo-empty">' +
                        '<span class="form-photo-icon">+</span>' +
                        '<span class="form-photo-empty-title">Attach Recent Photo</span>' +
                        '<span class="form-photo-empty-sub">2x2 &bull; JPG / PNG</span>' +
                    '</div>' +
                    '<img class="form-photo-preview-img" alt="Attached 2x2 photo" style="display:none;">' +
                '</div>' +
                '<div class="form-photo-controls">' +
                    '<input type="file" data-photo-input="1" accept="image/*" style="display:none;">' +
                    '<button type="button" class="form-photo-btn" data-photo-browse>Upload Photo</button>' +
                    '<button type="button" class="form-photo-btn form-photo-remove" data-photo-remove style="display:none;">Remove</button>' +
                '</div>' +
                '<div class="form-photo-name"></div>' +
            '</div>'
        );
    }


    function wireAllPhotoWidgets(root) {
        var scope = root || document;
        Array.prototype.forEach.call(
            scope.querySelectorAll(".form-photo-widget"),
            function (widget) { wirePhotoWidget(widget); }
        );
        refreshPhotoWidgets();
    }


    /* =========================================================
       BUTTONS
       ========================================================= */

    function bindButtons() {

        var btns =
            document.querySelectorAll(
                "[data-open-loan-form]"
            );

        Array.prototype.forEach.call(
            btns,
            function (btn) {

                btn.addEventListener(
                    "click",
                    function (e) {

                        e.preventDefault();

                        var key =
                            btn.getAttribute(
                                "data-form"
                            ) || "sc";


                        if (!configs[key]) {

                            console.warn(
                                "SCSLAI form configuration not found:",
                                key
                            );

                            return;

                        }


                        active = key;

                        currentValues = {};

                        currentSelections = {};

                        currentPhotoDataUrl = "";
                        currentPhotoName = "";


                        openModal();

                    }
                );

            }
        );

    }


    /* =========================================================
       FORM DIMENSIONS
       ========================================================= */

    function getWidth() {

        return cfg().width || 1275;

    }


    function getHeight() {

        return cfg().height || 2100;

    }


    function pageDims(pg2) {

        var c = cfg();

        if (pg2) {

            return {
                w: Number(c.width2 || c.width || 1275),
                h: Number(c.height2 || c.height || 2100)
            };

        }

        return {
            w: Number(c.width || 1275),
            h: Number(c.height || 2100)
        };

    }


    function hasPage2() {

        return !!cfg().hasPage2;

    }


    function hasBoxes() {

        return !!cfg().hasCheckboxes;

    }


    function useUpper() {

        return cfg().useUppercase !== false;

    }


    /* =========================================================
       HIDDEN FIELDS
       Fields listed in cfg().hiddenFields are still rendered
       in the DOM and auto-filled / collected (e.g. auto
       generated "Amount in Words" / "Payable Years in Words").

       They are hidden ONLY on the small-screen stacked
       fill-out view, where the modal is just a list of inputs
       and the value is already generated onto the form for
       the user.

       On desktops / laptops the modal shows the actual form
       image (fill-on-image), so these fields stay VISIBLE:
       the user watches them fill in automatically on the form
       itself as they type the amount / pick the years.
       ========================================================= */

    function isHiddenField(id) {

        var hidden =
            cfg().hiddenFields || [];

        return hidden.indexOf(id) !== -1;

    }


    /* =========================================================
       INK COLOR
       ========================================================= */

    function inkColor() {

        return cfg().inkColor || "#003f91";

    }


    function hexToRgb(hex) {

        var h =
            String(
                hex || "#003f91"
            ).replace(
                "#",
                ""
            );

        if (h.length === 3) {

            h = h.replace(
                /./g,
                function (ch) {
                    return ch + ch;
                }
            );

        }

        var n =
            parseInt(
                h,
                16
            );

        if (isNaN(n)) {

            n = 0x003f91;

        }

        return {

            r: (
                (n >> 16) & 255
            ) / 255,

            g: (
                (n >> 8) & 255
            ) / 255,

            b: (
                n & 255
            ) / 255

        };

    }


    /* =========================================================
       PDF PAPER SIZE
       ========================================================= */

    function pdfPageSize(dims) {

        var aw =
            Number(dims.w) || 1275;

        var ah =
            Number(dims.h) || 2100;

        var c =
            cfg();

        var L =
            window.PDFLib;


        /* -----------------------------------------------
           EXPLICIT OVERRIDE — points
           ----------------------------------------------- */

        if (
            Number(c.paperWidth) > 0 &&
            Number(c.paperHeight) > 0
        ) {

            return {

                w: Number(c.paperWidth),

                h: Number(c.paperHeight)

            };

        }


        /* -----------------------------------------------
           NAMED OVERRIDE — "A4" | "LETTER" | "LEGAL"
           ----------------------------------------------- */

        var name =
            String(
                c.paperSize || ""
            ).toUpperCase();

        if (
            L &&
            L.PageSizes &&
            L.PageSizes[name]
        ) {

            return {

                w: L.PageSizes[name][0],

                h: L.PageSizes[name][1]

            };

        }


        /* -----------------------------------------------
           AUTO — match the nearest standard paper size
           by aspect ratio (scans are Letter / Legal / A4)
           ----------------------------------------------- */

        var aspect =
            aw / ah;

        var candidates = [
            "A4",
            "LETTER",
            "LEGAL"
        ];

        var pick =
            null;

        var bestDiff =
            9999;


        candidates.forEach(
            function (key) {

                if (
                    !L ||
                    !L.PageSizes ||
                    !L.PageSizes[key]
                ) {

                    return;

                }

                var p =
                    L.PageSizes[key];

                var diff =
                    Math.abs(
                        (p[0] / p[1]) -
                        aspect
                    );

                if (
                    diff < bestDiff
                ) {

                    bestDiff =
                        diff;

                    pick = {

                        w: p[0],

                        h: p[1]

                    };

                }

            }
        );


        /* -----------------------------------------------
           FALLBACK — use the design pixels as points
           ----------------------------------------------- */

        return (
            pick || {
                w: aw,
                h: ah
            }
        );

    }


    /* =========================================================
       INPUT FIELD LABELS
       ========================================================= */

    var fieldLabels = {

        others: "Others",

        applicantName: "Applicant Name",

        amountWords: "Amount in Words",

        loanAmount: "Loan Amount",

        payableYearsWords: "Payable Years in Words",

        payableYears: "Payable Years",

        edpNumber: "EDP Number",

        tin: "TIN",

        birthdate: "Birthdate",

        placeOfBirth: "Place of Birth",

        lastName: "Last Name",

        firstName: "First Name",

        middleName: "Middle Name",

        suffix: "Suffix",

        officeStation: "Office / Station",

        position: "Position",

        appointment: "Status of Appointment",

        homeAddress: "Home Address",

        zipCode: "ZIP Code",

        printedName: "Printed Name",

        contactNumber: "Contact Number",

        emailAddress: "Email Address",

        pnNumber: "PN Number",

        pnAmountWords: "PN Amount in Words",

        pnAmountFigures: "PN Amount",

        pnInterestRate: "Interest Rate",

        pnRatePercent: "Rate Percent",

        pnInstallments: "Number of Installments",

        pnInstallmentAmt: "Installment Amount",

        pnAddlRate: "Additional Rate",

        pnPrintedName: "Printed Name"

    };


    function getFieldLabel(id) {

        var custom =
            cfg().fieldLabels || {};

        if (custom[id]) {

            return custom[id];

        }

        if (fieldLabels[id]) {

            return fieldLabels[id];

        }


        return id

            .replace(
                /([A-Z])/g,
                " $1"
            )

            .replace(
                /^./,
                function (s) {
                    return s.toUpperCase();
                }
            );

    }


    /* =========================================================
       GLOBAL FONT BOOST
       Multiplies every field's fs across ALL forms.
       1.25 = 25% bigger text in the fill view, the
       preview and the printed PDF. Raise or lower
       this one number to resize every form's ink.
       ========================================================= */

    var FS_BOOST = 1.25;

    function fieldFS(f) {

        return (Number(f && f.fs) || 12) * FS_BOOST;

    }


    /* =========================================================
       AUTO DATE
       Date fields (Date / Date Today / Date of Appointment,
       ...) are pre-filled with today's date. Birth-related
       fields (birthdate / spouse birth) are never auto-filled.
       ========================================================= */

    function todayISO() {

        var d = new Date();

        var m = String(d.getMonth() + 1);

        var day = String(d.getDate());

        if (m.length < 2) { m = "0" + m; }

        if (day.length < 2) { day = "0" + day; }

        return d.getFullYear() + "-" + m + "-" + day;

    }

    function isAutoDateId(id) {

        var s = String(id || "");

        return /date/i.test(s) && !/birth/i.test(s);

    }


    var AMOUNT_ONES = ["", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten", "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen", "Seventeen", "Eighteen", "Nineteen"];


    var AMOUNT_TENS = ["", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"];


    function parseLoanAmount(raw) {
        var cleaned = String(raw || "").replace(/,/g, "").replace(/[^0-9.]/g, "");
        if (!cleaned || cleaned === ".") { return NaN; }
        var parts = cleaned.split(".");
        if (parts.length > 2) { return NaN; }
        if (parts.length === 2 && parts[1].length > 2) { parts[1] = parts[1].slice(0, 2); }
        return parseFloat(parts.join("."));
    }


    function threeDigitsToWords(num) {
        var words = [];
        var hundreds = Math.floor(num / 100);
        var rest = num % 100;
        if (hundreds > 0) { words.push(AMOUNT_ONES[hundreds] + " Hundred"); }
        if (rest > 0) {
            if (rest < 20) { words.push(AMOUNT_ONES[rest]); }
            else {
                var tens = Math.floor(rest / 10);
                var ones = rest % 10;
                var tensWord = AMOUNT_TENS[tens];
                if (ones > 0) { tensWord += " " + AMOUNT_ONES[ones]; }
                words.push(tensWord);
            }
        }
        return words.join(" ");
    }


    function wholeNumberToWords(num) {
        if (!isFinite(num)) { return ""; }
        num = Math.floor(Math.abs(num));
        if (num === 0) { return "Zero"; }
        var scales = ["", "Thousand", "Million", "Billion"];
        var words = [];
        var scaleIndex = 0;
        while (num > 0 && scaleIndex < scales.length) {
            var chunk = num % 1000;
            if (chunk > 0) {
                var chunkWords = threeDigitsToWords(chunk);
                if (scales[scaleIndex]) { chunkWords += " " + scales[scaleIndex]; }
                words.unshift(chunkWords);
            }
            num = Math.floor(num / 1000);
            scaleIndex++;
        }
        return words.join(" ");
    }


    function loanAmountToWords(raw) {
        var value = parseLoanAmount(raw);
        if (isNaN(value) || value <= 0) { return ""; }
        var whole = Math.floor(value);
        var cents = Math.round((value - whole) * 100);
        if (cents === 100) { whole += 1; cents = 0; }
        var words = wholeNumberToWords(whole) + (whole === 1 ? " Peso" : " Pesos");
        if (cents > 0) { words += " and " + wholeNumberToWords(cents) + (cents === 1 ? " Centavo" : " Centavos"); }
        return words;
    }


    function formatLoanAmount(raw) {
        var text = String(raw || "");
        var trailingDot = /\.$/.test(text);
        var value = parseLoanAmount(text);
        if (isNaN(value)) { return text; }
        var parts = text.split(".");
        var decimals = parts.length > 1 ? Math.min(parts[1].replace(/[^0-9]/g, "").length, 2) : 0;
        var formatted = value.toLocaleString("en-US", { minimumFractionDigits: decimals, maximumFractionDigits: 2 });
        return trailingDot ? formatted + "." : formatted;
    }


    /* =========================================================
       AMOUNT FIELD IDS
       A form may declare which field holds the numeric amount
       (cfg().amountField, default "loanAmount") and which one
       receives the auto-generated words (cfg().amountWordsField,
       default "amountWords"). The loan application forms use the
       defaults; the Withdrawal form maps amountFigures ->
       amountWords.
       ========================================================= */

    function amountFieldId() {

        return cfg().amountField || "loanAmount";

    }


    function amountWordsFieldId() {

        return cfg().amountWordsField || "amountWords";

    }


    /* =========================================================
       AUTO-GENERATED FIELD
       These inputs are filled in by the engine itself, never
       by the user:
         - the amount in words (loanAmount / amountFigures)
         - the payable years in words (payableYears)
       They are rendered on the desktop fill-on-image view so
       the generated text is visible on the form, but are kept
       read-only so the generated value stays authoritative.
       ========================================================= */

    function isAutoFilledField(id) {

        return (
            id === amountWordsFieldId() ||
            id === "payableYearsWords"
        );

    }


    function syncAmountWordsFromLoanAmount() {
        var amountEl = document.getElementById(amountFieldId());
        var wordsEl = document.getElementById(amountWordsFieldId());
        if (!amountEl || !wordsEl) { return; }
        wordsEl.value = loanAmountToWords(amountEl.value);
        /*
            The value is written programmatically, so no input
            event fires — re-fit the box so the generated words
            are shown in full on the desktop fill-on-image view.
        */
        refitField(amountWordsFieldId());
    }


    function wireLoanAmountAutoFill() {
        var amountEl = document.getElementById(amountFieldId());
        if (!amountEl || amountEl.dataset.amountWired === "true") { return; }
        amountEl.dataset.amountWired = "true";
        amountEl.addEventListener("input", function () {
            var start = amountEl.selectionStart;
            var beforeLength = amountEl.value.length;
            amountEl.value = formatLoanAmount(amountEl.value);
            try {
                var next = (start || 0) + (amountEl.value.length - beforeLength);
                amountEl.setSelectionRange(next, next);
            } catch (err) {}
            syncAmountWordsFromLoanAmount();
        });
        amountEl.addEventListener("blur", function () {
            amountEl.value = formatLoanAmount(amountEl.value);
            syncAmountWordsFromLoanAmount();
        });
        syncAmountWordsFromLoanAmount();
    }


    /* =========================================================
       FIELD HTML
       ========================================================= */

    function fieldHTML(map) {

        return Object.keys(map).map(
            function (id) {

                var label =
                    getFieldLabel(id);

                var input = "";


                /* =================================================
                   PAYABLE YEARS
                   ================================================= */

                if (id === "payableYears") {

                    var opts = [];


                    for (
                        var n = 1;
                        n <= 5;
                        n++
                    ) {

                        opts.push(

                            '<option value="' +
                                n +
                            '">' +

                                n +

                                ' Year' +

                                (
                                    n > 1
                                        ? "s"
                                        : ""
                                ) +

                            '</option>'

                        );

                    }


                    input =

                        '<select ' +

                            'id="' +
                                id +
                            '" ' +

                            'class="loan-input">' +

                            '<option value="">' +
                                'Select' +
                            '</option>' +

                            opts.join("") +

                        '</select>';

                }


                /* =================================================
                   PAYABLE YEARS WORDS
                   ================================================= */

                else if (
                    id === "payableYearsWords"
                ) {

                    input =

                        '<input ' +

                            'type="text" ' +

                            'id="' +
                                id +
                            '" ' +

                            'class="loan-input" ' +

                            'readonly>';


                }


                /* =================================================
                   BIRTHDATE
                   ================================================= */

                else if (
                    id === "birthdate"
                ) {

                    input =

                        '<input ' +

                            'type="date" ' +

                            'id="' +
                                id +
                            '" ' +

                            'class="loan-input">';

                }


                /* =================================================
                   AUTO DATE — Date / Date Today / Date of
                   Appointment etc. default to today's date.
                   ================================================= */

                else if (
                    isAutoDateId(id)
                ) {

                    input =

                        '<input ' +

                            'type="date" ' +

                            'id="' +
                                id +
                            '" ' +

                            'class="loan-input" ' +

                            'value="' + todayISO() + '">';

                }


                /* =================================================
                   EMAIL
                   ================================================= */

                else if (
                    id === "emailAddress"
                ) {

                    input =

                        '<input ' +

                            'type="email" ' +

                            'id="' +
                                id +
                            '" ' +

                            'class="loan-input" ' +

                            'placeholder="example@email.com">';

                }


                /* =================================================
                   AMOUNT FIELD
                   (loanAmount on the loan forms, amountFigures
                   on the Withdrawal form — see cfg().amountField)
                   ================================================= */

                else if (
                    id === amountFieldId()
                ) {

                    input =

                        '<input ' +

                            'type="text" ' +

                            'id="' +
                                id +
                            '" ' +

                            'class="loan-input" ' +

                            'inputmode="decimal" ' +

                            'autocomplete="off" ' +

                            'placeholder="Enter loan amount">';

                }


                /* =================================================
                   NORMAL TEXT
                   ================================================= */

                else {

                    input =

                        '<input ' +

                            'type="text" ' +

                            'id="' +
                                id +
                            '" ' +

                            'class="loan-input" ' +

                            'maxlength="80">';

                }


                return (

                    '<div class="loan-field"' +

                        (isHiddenField(id) ? ' style="display:none;"' : '') +

                        '>' +

                        '<label for="' +
                            id +
                        '">' +

                            label +

                        '</label>' +

                        input +

                    '</div>'

                );

            }
        ).join("");

    }


    /* =========================================================
       CHECKBOX / RADIO HTML
       ========================================================= */

    function checkboxHTMLByCategory(category) {

        var cbMap =
            cfg().checkboxes || {};

        var labels =
            cfg().labels || {};


        return Object.keys(cbMap).map(
            function (id) {

                if (
                    cbMap[id].category !== category
                ) {

                    return "";

                }


                var radioName;


                /*
                 * REGULAR + SPECIAL
                 * share one radio group.
                 */

                if (
                    category === "regular" ||
                    category === "special"
                ) {

                    radioName =
                        "loan_type";

                }

                else {

                    radioName =
                        "loan_" +
                        category;

                }


                return (

                    '<label ' +

                        'class="modal-checkbox-item">' +


                        '<input ' +

                            'type="radio" ' +

                            'id="' +
                                id +
                            '" ' +

                            'name="' +
                                radioName +
                            '" ' +

                            'class="form-checkbox" ' +

                            'data-category="' +
                                category +
                            '" ' +

                            'value="' +
                                id +
                            '">' +


                        '<span>' +

                            (
                                labels[id] ||
                                id
                            ) +

                        '</span>' +


                    '</label>'

                );

            }
        ).join("");

    }


    /* =========================================================
       CHECKBOX / RADIO SECTION
       ========================================================= */

    function checkboxGroupTitle(category) {

        var known = {
            regular: "Type of Loan",
            special: "Special Loan",
            application: "Application Type",
            delivery: "Mode of Delivery"
        };

        if (known[category]) {

            return known[category];

        }

        return String(category)
            .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
            .replace(/[_-]+/g, " ")
            .replace(/\b[a-z]/g, function (c) {

                return c.toUpperCase();

            });

    }


    function checkboxCategories() {

        var cbMap =
            cfg().checkboxes || {};

        var order = [];
        var seen = {};

        Object.keys(cbMap).forEach(
            function (id) {

                var c =
                    cbMap[id] &&
                    cbMap[id].category;

                if (c && !seen[c]) {

                    seen[c] = true;
                    order.push(c);

                }

            }
        );

        /*
            Keep the loan application's group order
            (Type of Loan, Special Loan, Application
            Type, Mode of Delivery) and append any
            other categories in config order.
        */

        var preferred =
            ["regular", "special", "application", "delivery"];

        order.sort(
            function (a, b) {

                var ia = preferred.indexOf(a);
                var ib = preferred.indexOf(b);

                if (ia === -1 && ib === -1) { return 0; }
                if (ia === -1) { return 1; }
                if (ib === -1) { return -1; }

                return ia - ib;

            }
        );

        return order;

    }


    function checkboxHTML() {

        if (!hasBoxes()) {

            return "";

        }


        var groups = checkboxCategories().map(
            function (category) {

                var items =
                    checkboxHTMLByCategory(category);

                if (!items) {

                    return "";

                }

                return (

                    '<div class="modal-checkbox-group">' +

                        '<h3>' +
                            checkboxGroupTitle(category) +
                        '</h3>' +

                        '<div class="loan-checkbox-list">' +

                            items +

                        '</div>' +

                    '</div>'

                );

            }
        ).join("");

        if (!groups) {

            return "";

        }

        return (

            '<div class="modal-checkbox-section">' +

                groups +

            '</div>'

        );

    }


    /* =========================================================
       DESKTOP FILL-ON-IMAGE VIEW
       On laptops/desktops the actual form PNG is shown and
       inputs are positioned directly on top of it, using the
       same x / y / w / h coordinates as the preview / PDF.
       Smaller devices keep the stacked fill-out form.
       ========================================================= */

    function isDesktopView() {

        return (
            window.innerWidth ||
            document.documentElement.clientWidth ||
            0
        ) >= 900;

    }


    function imageInputHTML(id) {

        var cls = "form-input";


        if (id === "payableYears") {

            var opts = [];

            for (var n = 1; n <= 5; n++) {

                opts.push(
                    '<option value="' + n + '">' +
                        n + ' Year' + (n > 1 ? "s" : "") +
                    '</option>'
                );

            }

            return (
                '<select id="' + id + '" class="' + cls +
                ' form-select">' +
                '<option value="">Select</option>' +
                opts.join("") +
                '</select>'
            );

        }


        if (id === "birthdate") {

            return (
                '<input type="date" id="' + id +
                '" class="' + cls + '">'
            );

        }


        /* AUTO DATE — defaults to today's date. */

        if (isAutoDateId(id)) {

            return (
                '<input type="date" id="' + id +
                '" class="' + cls +
                '" value="' + todayISO() + '">'
            );

        }


        if (id === "emailAddress") {

            return (
                '<input type="email" id="' + id +
                '" class="' + cls +
                '" placeholder="example@email.com">'
            );

        }


        if (id === amountFieldId()) {

            return (
                '<input type="text" id="' + id +
                '" class="' + cls +
                '" inputmode="decimal" autocomplete="off"' +
                ' placeholder="Enter amount">'
            );

        }


        var upper =
            useUpper() ? " form-upper" : "";


        /*
            AUTO-GENERATED FIELDS
            Amount in Words / Payable Years in Words are filled
            in by the engine. On the desktop fill-on-image view
            they must stay VISIBLE (the user watches them fill
            in on the form) but read-only, so the generated
            value is always what is collected / printed.
        */
        if (isAutoFilledField(id)) {

            return (
                '<input type="text" id="' + id +
                '" class="' + cls + upper +
                '" readonly tabindex="-1">'
            );

        }


        /*
            No maxlength on the desktop fill view:
            long answers stay fully visible and are
            drawn the same way in preview / print.
        */
        return (
            '<input type="text" id="' + id +
            '" class="' + cls + upper +
            '">'
        );

    }


    function wireImageCanvas(maps) {

        /*
            Keep input fonts scaled with the rendered
            canvas whenever the window is resized.
        */

        wireCanvasScale();

        Array.prototype.forEach.call(
            document.querySelectorAll(
                ".loan-form-canvas[data-canvas-page]"
            ),
            function (canvas) {

                var pageNumber =
                    Number(
                        canvas.getAttribute(
                            "data-canvas-page"
                        )
                    ) || 1;


                var isP2 =
                    pageNumber === 2;


                var map =
                    (maps && maps[pageNumber]) ||
                    (isP2
                        ? (cfg().page2Fields || {})
                        : (cfg().fields || {}));


                var dims =
                    pageDims(isP2);

                /*
                    Remember the design width so the
                    input font can be scaled with the
                    rendered canvas (same math as the
                    preview / printed output).
                */

                canvas.dataset.designW =
                    String(dims.w);

                /*
                    Never stretch the form image wider
                    than its design width: the preview
                    and printed PDF render the page at
                    min(designWidth, available) too.
                    Without this cap the image grows but
                    the text stays at the form's own
                    size, which makes the typed text
                    look too small on small-design
                    forms.
                */

                canvas.style.maxWidth =
                    dims.w + "px";


                /* ---------- TEXT INPUTS ---------- */

                Object.keys(map).forEach(
                    function (id) {

                        var f = map[id];

                        if (!f) { return; }


                        var wrap =
                            document.createElement("div");


                        wrap.innerHTML =
                            imageInputHTML(id);


                        var input =
                            wrap.firstChild;


                        input.style.left =
                            (Number(f.x) / dims.w * 100) + "%";

                        input.style.top =
                            (Number(f.y) / dims.h * 100) + "%";

                        input.style.width =
                            (Number(f.w) / dims.w * 100) + "%";

                        input.style.height =
                            (Number(f.h) / dims.h * 100) + "%";

                        input.dataset.fs =
                            String(fieldFS(f));

                        /*
                            Remember the field's design
                            width so the input can grow
                            for long values (auto-fit).
                        */
                        input.dataset.cfgW =
                            String(Number(f.w) || 0);

                        /*
                            Remember the field's configured
                            left position so auto-fit can grow
                            the box symmetrically (centered on
                            the field) without drifting.
                        */
                        input.dataset.leftPct =
                            input.style.left;

                        applyInputScale(input, canvas);

                        if (
                            input.tagName === "INPUT" &&
                            input.type === "text"
                        ) {

                            input.addEventListener(
                                "input",
                                function () {
                                    fitInputToContent(
                                        input,
                                        canvas
                                    );
                                }
                            );

                        }

                        canvas.appendChild(input);

                        fitInputToContent(input, canvas);

                    }
                );


                /* ---------- CHECKBOXES ---------- */

                if (!isP2 && hasBoxes()) {

                    var cbMap =
                        cfg().checkboxes || {};

                    var labels =
                        cfg().labels || {};


                    Object.keys(cbMap).forEach(
                        function (id) {

                            var c = cbMap[id];

                            var cw =
                                Number(c.w) || 15;

                            var ch =
                                Number(c.h) || 15;


                            var cb =
                                document.createElement("input");


                            cb.type = "checkbox";

                            cb.id = id;

                            cb.className = "form-checkbox";

                            cb.value = id;

                            cb.name =
                                c.category === "regular" ||
                                c.category === "special"
                                    ? "loan_type"
                                    : "loan_" + c.category;

                            cb.setAttribute(
                                "data-category",
                                c.category
                            );

                            cb.title =
                                labels[id] || id;


                            cb.style.left =
                                ((Number(c.cx) - cw / 2) / dims.w * 100) + "%";

                            cb.style.top =
                                ((Number(c.cy) - ch / 2) / dims.h * 100) + "%";


                            canvas.appendChild(cb);

                        }
                    );

                }

            }
        );

    }


    /* =========================================================
       INPUT FONT SCALING
       The preview / printed output draws values at
       (f.fs * fit) where fit = renderedWidth / designWidth.
       The on-image inputs must use the SAME formula so the
       text you type is the same size as the preview.
       ========================================================= */

    function applyInputScale(input, canvas) {

        var fs =
            Number(input.dataset.fs) || 12;

        var designW =
            Number(canvas.dataset.designW) || 0;

        var clientW =
            canvas.clientWidth;

        if (!designW || !clientW) { return; }

        /*
            Match the preview exactly: the preview caps
            its scale at 1 (fit = min(1, bodyW/dims.w)),
            so a form image with a small design width
            never gets enlarged text. Apply the same cap
            here so the typed text is the same size as
            the preview / printed output.
        */

        var factor =
            Math.min(
                1,
                clientW / designW
            );

        input.style.fontSize =
            (fs * factor) + "px";

        /*
            PLACEMENT FIX
            The preview and the printed form draw the value
            as a single line that starts at the field's top
            (f.y). The browser vertically centers an input's
            text inside its box, so with the configured box
            height the typed text sits LOWER than the
            preview / print. Give single-line inputs exactly
            one line of height so the centered glyphs land
            on the same spot.
        */

        if (
            input.tagName === "INPUT" &&
            (input.type === "text" ||
             input.type === "date")
        ) {

            input.style.height =
                (fs * factor * 1.2) + "px";

        }

    }


    /* =========================================================
       AUTO-FIT INPUT WIDTH
       A long value must never be clipped: the input grows
       toward the right edge of the form canvas while never
       shrinking below its configured field width.
       ========================================================= */

    var textMeasurer = null;

    function fitInputToContent(input, canvas) {

        if (
            input.tagName !== "INPUT" ||
            input.type !== "text"
        ) { return; }

        var canvasW =
            canvas.clientWidth;

        var designW =
            Number(canvas.dataset.designW) || 0;

        if (!canvasW || !designW) { return; }

        var cfgW =
            Number(input.dataset.cfgW) || 0;

        var configPx =
            (cfgW / designW) * canvasW;

        var leftPct =
            parseFloat(input.dataset.leftPct) || 0;

        var leftPx =
            leftPct / 100 * canvasW;

        var value =
            input.value;

        if (!value) {

            input.style.width =
                configPx + "px";

            return;

        }

        if (!textMeasurer) {

            textMeasurer =
                document.createElement("span");

            textMeasurer.style.position =
                "absolute";

            textMeasurer.style.visibility =
                "hidden";

            textMeasurer.style.whiteSpace =
                "pre";

            document.body.appendChild(
                textMeasurer
            );

        }

        var cs =
            window.getComputedStyle(input);

        textMeasurer.style.fontFamily =
            cs.fontFamily;

        textMeasurer.style.fontSize =
            cs.fontSize;

        textMeasurer.style.fontWeight =
            cs.fontWeight;

        textMeasurer.style.fontStyle =
            cs.fontStyle;

        textMeasurer.style.letterSpacing =
            cs.letterSpacing;

        textMeasurer.style.textTransform =
            cs.textTransform;

        textMeasurer.textContent = value;

        var needed =
            textMeasurer.offsetWidth + 8;

        var avail =
            canvasW - leftPx - 2;

        var width =
            Math.min(
                Math.max(configPx, needed),
                Math.max(configPx, avail)
            );

        input.style.width = width + "px";

        /*
            Grow symmetrically: keep the configured
            field's CENTER fixed so the centered text
            stays over the same spot as the preview /
            printed form. Clamp inside the canvas.
        */

        if (width > configPx) {

            var centerPx =
                leftPx + configPx / 2;

            var newLeft =
                Math.max(
                    2,
                    Math.min(
                        centerPx - width / 2,
                        canvasW - width - 2
                    )
                );

            input.style.left = newLeft + "px";

        } else {

            input.style.left = leftPct + "%";

        }

    }


    /* =========================================================
       REFIT AUTO-GENERATED FIELD
       "Amount in Words" / "Payable Years in Words" are written
       to their inputs programmatically, so no input event ever
       fires for them. Re-run the auto-fit for that box so the
       generated text is shown in full on the desktop
       fill-on-image view (the stacked mobile view has no
       canvas parent, so this is a no-op there).
       ========================================================= */

    function refitField(id) {

        var el =
            document.getElementById(id);

        if (!el) { return; }

        var canvas =
            el.parentNode;

        if (
            !canvas ||
            !canvas.classList ||
            !canvas.classList.contains(
                "loan-form-canvas"
            )
        ) { return; }

        fitInputToContent(el, canvas);

    }


    function scaleAllCanvasInputs() {

        Array.prototype.forEach.call(
            document.querySelectorAll(
                ".loan-form-canvas"
            ),
            function (canvas) {

                var designW =
                    Number(canvas.dataset.designW) || 0;

                var clientW =
                    canvas.clientWidth;

                if (!designW || !clientW) { return; }

                var factor =
                    Math.min(
                        1,
                        clientW / designW
                    );

                Array.prototype.forEach.call(
                    canvas.querySelectorAll(".form-input"),
                    function (input) {

                        input.style.fontSize =
                            ((Number(input.dataset.fs) || 12) * factor) + "px";

                        if (
                            input.tagName === "INPUT" &&
                            (input.type === "text" ||
                             input.type === "date")
                        ) {

                            input.style.height =
                                ((Number(input.dataset.fs) || 12) *
                                 factor * 1.2) + "px";

                        }

                        fitInputToContent(input, canvas);

                    }
                );

            }
        );

    }


    var canvasScaleWired = false;

    function wireCanvasScale() {

        if (canvasScaleWired) { return; }

        canvasScaleWired = true;

        window.addEventListener(
            "resize",
            scaleAllCanvasInputs
        );

    }


    /* =========================================================
       REBUILD FORM
       ========================================================= */

    function rebuildCanvases() {

        var bd =
            document.querySelector(
                ".loan-modal-body"
            );


        if (!bd) {

            console.warn(
                ".loan-modal-body not found."
            );

            return;

        }


        var pages =
            hasPage2()
                ? [1, 2]
                : [1];


        var html = "";

        var desktopMaps = {};


        /* =================================================
           DESKTOP: FILL DIRECTLY ON THE FORM IMAGE
           ================================================= */

        if (isDesktopView()) {

            var desktopHtml = "";


            pages.forEach(
                function (n) {

                    var isP2 = n === 2;

                    var map =
                        isP2
                            ? (cfg().page2Fields || {})
                            : (cfg().fields || {});

                    var dims =
                        pageDims(isP2);

                    var imageSrc =
                        (cfg().images || [])[
                            n - 1
                        ] || "";

                    var photoSlotHtml = "";

                    if (!isP2 && hasPhotoBox()) {
                        var pb = getPhotoBox();
                        var pLeft = (Number(pb.x) / dims.w) * 100;
                        var pTop = (Number(pb.y) / dims.h) * 100;
                        var pW = (Number(pb.w) / dims.w) * 100;
                        var pH = (Number(pb.h) / dims.h) * 100;
                        photoSlotHtml =
                            '<div class="form-photo-canvas-slot" ' +
                                'style="position:absolute;' +
                                'left:' + pLeft + '%;' +
                                'top:' + pTop + '%;' +
                                'width:' + pW + '%;' +
                                'height:' + pH + '%;' +
                                'z-index:6;">' +
                                photoWidgetHTML("form-photo-canvas") +
                            '</div>';
                    }

                    desktopHtml +=

                        '<div class="loan-form-page loan-image-page">' +


                            '<div class="loan-form-canvas"' +

                                ' data-canvas-page="' + n + '"' +

                                ' style="aspect-ratio:' +
                                    dims.w + ' / ' + dims.h + ';">' +


                                '<img src="' +
                                    escapeHTML(imageSrc) +
                                    '" class="loan-form-background"' +
                                    ' alt="Form page ' + n + '">' +

                                photoSlotHtml +

                            '</div>' +

                        '</div>';


                    /*
                     * Remember the field map per page so
                     * wireImageCanvas can position inputs.
                     */

                    desktopMaps[n] = map;

                }
            );


            html += desktopHtml;

        }

        else {

        pages.forEach(
            function (n) {

                var isP2 =
                    n === 2;


                var map =
                    isP2
                        ? (
                            cfg().page2Fields ||
                            {}
                        )
                        : (
                            cfg().fields ||
                            {}
                        );


                html +=

                    '<div class="loan-form-page">' +


                        (
                            !isP2 &&
                            hasPhotoBox()

                                ? photoWidgetHTML("form-photo-stacked")

                                : ""
                        ) +


                        (
                            !isP2 &&
                            hasBoxes()

                                ? checkboxHTML()

                                : ""
                        ) +


                        '<div class="loan-form-fields">' +

                            fieldHTML(map) +

                        '</div>' +


                    '</div>';

            }
        );

        } /* end stacked (mobile) branch */


        /* =================================================
           ACTION BUTTONS
           ================================================= */

        html +=

            '<div class="modal-actions">' +


                '<button ' +

                    'type="button" ' +

                    'id="cancelLoanModal">' +

                    'Cancel' +

                '</button>' +


                '<button ' +

                    'type="submit" ' +

                    'id="completeLoanModal">' +

                    'Complete' +

                '</button>' +


            '</div>';


        var form =
            document.getElementById(
                "loanApplicationForm"
            );


        if (!form) {

            console.error(
                "#loanApplicationForm was not found."
            );

            return;

        }


        form.innerHTML =
            html;


        wireAllPhotoWidgets(form);

        /* =================================================
           DESKTOP: POSITION INPUTS ON THE FORM IMAGE
           ================================================= */

        if (isDesktopView()) {

            wireImageCanvas(desktopMaps);

        }


        /* =================================================
           CANCEL
           ================================================= */

        var cancel =
            document.getElementById(
                "cancelLoanModal"
            );


        if (cancel) {

            cancel.addEventListener(
                "click",
                closeModal
            );

        }


        /* =================================================
           PAYABLE YEARS
           ================================================= */

        wirePayableAutoFill();

        wireLoanAmountAutoFill();


        /* =================================================
           RESTORE VALUES
           ================================================= */

        if (
            Object.keys(currentValues).length ||
            Object.keys(currentSelections).length
        ) {

            restoreValues();

        }

    }


    /* =========================================================
       OPEN MODAL
       ========================================================= */

    function openModal() {

        if (!modal) {

            console.warn(
                "#loanModal was not found."
            );

            return;

        }


        var h2 =
            modal.querySelector(
                ".loan-modal-header h2"
            );


        if (h2) {

            h2.textContent =
                cfg().title ||
                "Loan Application";

        }


        rebuildCanvases();


        modal.classList.add(
            "active"
        );


        body.classList.add(
            "loan-modal-open"
        );


        modal.setAttribute(
            "aria-hidden",
            "false"
        );


        /* =================================================
           RESCALE INPUT FONTS
           The canvas has a real width only now that the
           modal is visible. Run once immediately and once
           on the next frame (after layout settles).
           ================================================= */

        scaleAllCanvasInputs();

        if (window.requestAnimationFrame) {

            window.requestAnimationFrame(
                scaleAllCanvasInputs
            );

        }


        var modalBody =
            modal.querySelector(
                ".loan-modal-body"
            );


        if (modalBody) {

            modalBody.scrollTop = 0;

        }


        body.style.overflow =
            "hidden";

    }


    /* =========================================================
       CLOSE MODAL
       ========================================================= */

    function closeModal() {

        if (!modal) {

            return;

        }


        modal.classList.remove(
            "active"
        );


        body.classList.remove(
            "loan-modal-open"
        );


        modal.setAttribute(
            "aria-hidden",
            "true"
        );


        body.style.overflow = "";

    }


    /* =========================================================
       NUMBER TO WORDS
       ========================================================= */

    var numW = [

        "",

        "ONE",

        "TWO",

        "THREE",

        "FOUR",

        "FIVE",

        "SIX",

        "SEVEN",

        "EIGHT",

        "NINE",

        "TEN",

        "ELEVEN",

        "TWELVE",

        "THIRTEEN",

        "FOURTEEN",

        "FIFTEEN",

        "SIXTEEN",

        "SEVENTEEN",

        "EIGHTEEN",

        "NINETEEN"

    ];


    var tenW = [

        "",

        "",

        "TWENTY",

        "THIRTY",

        "FORTY",

        "FIFTY",

        "SIXTY",

        "SEVENTY",

        "EIGHTY",

        "NINETY"

    ];


    function n2w(n) {

        var x =
            parseInt(
                n,
                10
            );


        if (
            isNaN(x) ||
            x < 1 ||
            x > 30
        ) {

            return "";

        }


        if (x < 20) {

            return numW[x];

        }


        return (

            tenW[
                Math.floor(
                    x / 10
                )
            ] +

            (
                x % 10

                    ? "-" +
                        numW[x % 10]

                    : ""
            )

        );

    }


    /* =========================================================
       PAYABLE YEARS AUTO FILL
       ========================================================= */

    function wirePayableAutoFill() {

        var p =
            document.getElementById(
                "payableYears"
            );


        var w =
            document.getElementById(
                "payableYearsWords"
            );


        if (!p || !w) {

            return;

        }


        p.addEventListener(
            "change",
            function () {

                w.value =
                    n2w(
                        this.value
                    );

                /*
                    Written programmatically — re-fit the box so
                    the generated words are shown in full on the
                    desktop fill-on-image view.
                */
                refitField(
                    "payableYearsWords"
                );

            }
        );

    }


    /* =========================================================
       GET VALUE
       ========================================================= */

    function getVal(id) {

        var el =
            document.getElementById(id);


        if (!el) {

            return "";

        }


        return String(
            el.value || ""
        ).trim();

    }


    /* =========================================================
       GET CHECKED ITEMS
       ========================================================= */

    function checkedOf(cat) {

        var cbMap =
            cfg().checkboxes || {};

        var labels =
            cfg().labels || {};

        var list = [];


        Object.keys(cbMap).forEach(
            function (key) {

                if (
                    cbMap[key].category !== cat
                ) {

                    return;

                }


                var el =
                    document.getElementById(
                        key
                    );


                if (
                    el &&
                    el.checked
                ) {

                    list.push({

                        id: key,

                        label:
                            labels[key] ||
                            key

                    });

                }

            }
        );


        return list;

    }


    /* =========================================================
       COLLECT FORM DATA
       ========================================================= */

    function collectValues() {

        var fields =
            Object.assign(
                {},
                cfg().fields || {},
                cfg().page2Fields || {}
            );


        var vals = {};


        Object.keys(fields).forEach(
            function (id) {

                var el =
                    document.getElementById(
                        id
                    );


                if (el) {

                    vals[id] =
                        String(
                            el.value || ""
                        ).trim();

                }

                else {

                    vals[id] = "";

                }

            }
        );


        return vals;

    }


    /* =========================================================
       ESCAPE HTML
       ========================================================= */

    function escapeHTML(value) {

        return String(value)

            .replace(
                /&/g,
                "&amp;"
            )

            .replace(
                /</g,
                "&lt;"
            )

            .replace(
                />/g,
                "&gt;"
            )

            .replace(
                /"/g,
                "&quot;"
            )

            .replace(
                /'/g,
                "&#039;"
            );

    }


    /* =========================================================
    SHOW PREVIEW
    ========================================================= */

    function previewPhotoHTML(pbox, dims, fit) {
        var pLeft = (Number(pbox.x) / dims.w) * 100;
        var pTop = (Number(pbox.y) / dims.h) * 100;
        var pW = (Number(pbox.w) / dims.w) * 100;
        var pH = (Number(pbox.h) / dims.h) * 100;
        var emptyFs = 13 * (Number(fit) || 1);
        return (
            '<div class="preview-photo" ' +
                'style="' +
                    'position:absolute;' +
                    'left:' + pLeft + '%;' +
                    'top:' + pTop + '%;' +
                    'width:' + pW + '%;' +
                    'height:' + pH + '%;' +
                    'overflow:hidden;' +
                    'background:#ffffff;' +
                    'border:1px solid #999;' +
                    'z-index:2;' +
                '">' +
                '<div class="preview-photo-empty" ' +
                    'style="display:flex;' +
                    'width:100%;height:100%;' +
                    'align-items:center;justify-content:center;' +
                    'font-size:' + emptyFs + 'px;' +
                    'color:#666;text-align:center;' +
                    'font-family:Arial,sans-serif;">' +
                    'Attach Recent Photo (2x2)' +
                '</div>' +
                '<img class="preview-photo-img" alt="" ' +
                    'style="display:none;' +
                    'width:100%;height:100%;' +
                    'object-fit:cover;' +
                    'object-position:center top;">' +
            '</div>'
        );
    }


    function showPreview(vals, selections) {

        console.log(
            "Opening preview for:",
            active,
            cfg()
        );

        currentValues =
            vals || {};

        currentSelections =
            selections || {};


        /* =====================================================
        REMOVE OLD PREVIEW
        ===================================================== */

        var existing =
            document.getElementById(
                "scslaiFormPreview"
            );

        if (existing) {
            existing.remove();
        }


        /* =====================================================
        CREATE PREVIEW
        ===================================================== */

        var preview =
            document.createElement("div");

        preview.id =
            "scslaiFormPreview";

        preview.className =
            "loan-preview-overlay";


        var formConfig =
            cfg();

        var pages =
            formConfig.hasPage2
                ? [1, 2]
                : [1];

        var images =
            formConfig.images || [];


        var html = "";


        /* =====================================================
        FIT WIDTH
        Scale the page so the WHOLE form is visible in the
        preview without cropping and without distortion.
        The aspect ratio is preserved — no shrinkage.
        ===================================================== */

        var viewW =
            window.innerWidth ||
            document.documentElement.clientWidth ||
            1280;

        var winW =
            Math.min(
                1200,
                viewW - 30
            );

        var bodyW =
            Math.max(
                320,
                winW - 50
            );


        html +=
            '<div class="loan-preview-window">' +

                '<div class="loan-preview-header">' +

                    '<h2>' +
                        escapeHTML(
                            formConfig.title ||
                            "Form Preview"
                        ) +
                    '</h2>' +

                    '<button ' +
                        'type="button" ' +
                        'id="closePreview">' +
                        '&times;' +
                    '</button>' +

                '</div>' +

                '<div class="loan-preview-body">';


        /* =====================================================
        BUILD PAGES
        ===================================================== */

        pages.forEach(function(pageNumber) {

            var isPage2 =
                pageNumber === 2;


            var map =
                isPage2
                    ? (
                        formConfig.page2Fields ||
                        {}
                    )
                    : (
                        formConfig.fields ||
                        {}
                    );


            var dims =
                pageDims(isPage2);


            var fit =
                Math.min(
                    1,
                    bodyW / dims.w
                );


            var pageW =
                Math.round(
                    dims.w * fit
                );


            var pageH =
                Math.round(
                    dims.h * fit
                );


            var imageSrc =
                images[pageNumber - 1] || "";


            if (!imageSrc) {

                console.warn(
                    "No image configured for page " +
                    pageNumber +
                    " of form " +
                    active
                );

            }


            /* =================================================
            PAGE CONTAINER
            ================================================= */

            html +=

                '<div ' +

                    'class="preview-page" ' +

                    'data-page="' +
                        pageNumber +
                    '" ' +

                    'data-form="' +
                        escapeHTML(active) +
                    '" ' +

                    'style="' +

                        'position:relative;' +

                        'width:' +
                            pageW +
                            'px;' +

                        'height:' +
                            pageH +
                            'px;' +

                        'overflow:hidden;' +

                    '">' +


                    /* =================================================
                    BACKGROUND IMAGE
                    ================================================= */

                    '<img ' +

                        'src="' +
                            escapeHTML(imageSrc) +
                        '" ' +

                        'class="preview-background" ' +

                        'alt="Form page ' +
                            pageNumber +
                        '" ' +

                        'style="' +

                            'position:absolute;' +

                            'left:0;' +

                            'top:0;' +

                            'width:100%;' +

                            'height:100%;' +

                            'display:block;' +

                            'object-fit:fill;' +

                            'z-index:0;' +

                        '">' ;

            if (!isPage2 && hasPhotoBox()) {
                var pbox0 = getPhotoBox();
                html += previewPhotoHTML(pbox0, dims, fit);
            }



            /* =====================================================
            TEXT FIELDS
            ===================================================== */

            Object.keys(map).forEach(function(id) {

                var f =
                    map[id];


                if (!f) {
                    return;
                }


                var value =
                    currentValues[id];


                if (
                    value === undefined ||
                    value === null ||
                    String(value).trim() === ""
                ) {

                    return;

                }


                var left =
                    (
                        Number(f.x) /
                        dims.w
                    ) * 100;


                var top =
                    (
                        Number(f.y) /
                        dims.h
                    ) * 100;


                var width =
                    (
                        Number(f.w) /
                        dims.w
                    ) * 100;


                var height =
                    (
                        Number(f.h) /
                        dims.h
                    ) * 100;


                var fontSize =
                    fieldFS(f) * fit;


                var text =
                    useUpper()
                        ? String(value).toUpperCase()
                        : String(value);


                html +=

                    '<div ' +

                        'class="preview-value" ' +

                        'data-field="' +
                            escapeHTML(id) +
                        '" ' +

                        'style="' +

                            'position:absolute;' +

                            'left:' +
                                left +
                            '%;' +

                            'top:' +
                                top +
                            '%;' +

                            'width:' +
                                width +
                            '%;' +

                            'height:' +
                                height +
                            '%;' +

                            'font-size:' +
                                fontSize +
                            'px;' +

                            'line-height:1.2;' +

                            'white-space:pre;' +

                            'overflow:visible;' +

                            'z-index:2;' +

                            'color:' +
                                inkColor() +
                                ';' +

                            'font-family:Arial,sans-serif;' +

                            'text-align:center;' +

                            'font-weight:bold;' +

                        '">' +

                        escapeHTML(text) +

                    '</div>';

            });


            /* =====================================================
            CHECKBOX MARKS
            ===================================================== */

            if (
                !isPage2 &&
                formConfig.hasCheckboxes
            ) {

                var cbMap =
                    formConfig.checkboxes || {};


                Object.keys(cbMap).forEach(function(id) {

                    var item =
                        cbMap[id];


                    if (
                        !currentSelections[id]
                    ) {

                        return;

                    }


                    var cx =
                        Number(item.cx) || 0;


                    var cy =
                        Number(item.cy) || 0;


                    var cw =
                        Number(item.w) || 15;


                    var ch =
                        Number(item.h) || 15;


                    var left =
                        (
                            (cx - cw / 2) /
                            dims.w
                        ) * 100;


                    var top =
                        (
                            (cy - ch / 2) /
                            dims.h
                        ) * 100;


                    var width =
                        (
                            cw /
                            dims.w
                        ) * 100;


                    var height =
                        (
                            ch /
                            dims.h
                        ) * 100;


                    html +=

                        '<div ' +

                            'class="preview-check" ' +

                            'data-checkbox="' +
                                escapeHTML(id) +
                            '" ' +

                            'style="' +

                                'position:absolute;' +

                                'left:' +
                                    left +
                                '%;' +

                                'top:' +
                                    top +
                                '%;' +

                                'width:' +
                                    width +
                                '%;' +

                                'height:' +
                                    height +
                                '%;' +

                                'display:flex;' +

                                'align-items:center;' +

                                'justify-content:center;' +

                                'font-size:' +
                                    (
                                        Math.max(
                                            12,
                                            Math.min(
                                                cw,
                                                ch
                                            )
                                        ) * fit
                                    ) +
                                    'px;' +

                                'font-weight:bold;' +

                                'color:' +
                                    inkColor() +
                                    ';' +

                                'z-index:3;' +

                            '">' +

                            '✓' +

                        '</div>';

                });

            }


            html +=
                '</div>';

        });


        /* =====================================================
        FOOTER
        ===================================================== */

        html +=

                '</div>' +

                '<div class="loan-preview-footer">' +

                    '<button ' +

                        'type="button" ' +

                        'id="editLoanForm">' +

                        'Edit Information' +

                    '</button>' +

                    '<button ' +

                        'type="button" ' +

                        'id="downloadLoanPDF">' +

                        '<i class="fas fa-print"></i> ' +

                        'Print / Download' +

                    '</button>' +

                '</div>' +

            '</div>';


        preview.innerHTML =
            html;


        document.body.appendChild(
            preview
        );

        wireAllPhotoWidgets(preview);
        refreshPhotoWidgets();



        /* =====================================================
        CLOSE
        ===================================================== */

        var close =
            document.getElementById(
                "closePreview"
            );


        if (close) {

            close.addEventListener(
                "click",
                function() {

                    preview.remove();

                }
            );

        }


        /* =====================================================
        EDIT
        ===================================================== */

        var edit =
            document.getElementById(
                "editLoanForm"
            );


        if (edit) {

            edit.addEventListener(
                "click",
                function() {

                    preview.remove();

                    openModal();

                    restoreValues();

                }
            );

        }


        /* =====================================================
        PRINT / DOWNLOAD
        ===================================================== */

        var download =
            document.getElementById(
                "downloadLoanPDF"
            );


        if (download) {

            download.addEventListener(
                "click",
                function() {

                    generatePDF(
                        currentValues,
                        currentSelections
                    );

                }
            );

        }

    }


    /* =========================================================
       RESTORE VALUES
       ========================================================= */

    function restoreValues() {

        /* =================================================
           RESTORE TEXT INPUTS
           ================================================= */

        Object.keys(
            currentValues || {}
        ).forEach(
            function (id) {

                var el =
                    document.getElementById(
                        id
                    );


                if (!el) {

                    return;

                }


                el.value =
                    currentValues[id];

            }
        );


        /* =================================================
           RESTORE RADIO BUTTONS
           ================================================= */

        Object.keys(
            currentSelections || {}
        ).forEach(
            function (id) {

                var el =
                    document.getElementById(
                        id
                    );


                if (el) {

                    el.checked =
                        !!currentSelections[id];

                }

            }
        );


        /* =================================================
           RESTORE PAYABLE YEARS WORDS
           ================================================= */

        var payable =
            document.getElementById(
                "payableYears"
            );


        var payableWords =
            document.getElementById(
                "payableYearsWords"
            );


        if (
            payable &&
            payableWords
        ) {

            payableWords.value =
                n2w(
                    payable.value
                );

            /*
                Restored programmatically — re-fit the box so the
                restored words are shown in full.
            */
            refitField(
                "payableYearsWords"
            );

        }


        /* =================================================
           RESTORE AMOUNT IN WORDS
           ================================================= */

        syncAmountWordsFromLoanAmount();

    }


    /* =========================================================
       IMAGE TO DATA URL
       ========================================================= */

    function img2url(img) {

        var c =
            document.createElement(
                "canvas"
            );


        c.width =
            img.naturalWidth ||
            getWidth();


        c.height =
            img.naturalHeight ||
            getHeight();


        var ctx =
            c.getContext(
                "2d"
            );


        ctx.drawImage(
            img,
            0,
            0,
            c.width,
            c.height
        );


        return c.toDataURL(
            "image/png"
        );

    }


    /* =========================================================
       SAVE PDF DOCUMENT
       ========================================================= */

    async function savePdfDocument(
        doc,
        values
    ) {

        var bytes =
            await doc.save();

        var blob =
            new Blob(
                [bytes],
                {
                    type:
                        "application/pdf"
                }
            );

        var url =
            URL.createObjectURL(
                blob
            );

        var a =
            document.createElement(
                "a"
            );

        var lastName =
            values &&
            values.lastName
                ? String(values.lastName)
                : "";

        a.href =
            url;

        a.download =

            "SCSLAI-" +

            (
                cfg().pdfPrefix ||
                ""
            ) +

            (
                cfg().pdfSuffix ||
                "Loan-Application"
            ) +

            (
                lastName
                    ? "-" + lastName
                    : ""
            ) +

            ".pdf";

        document.body.appendChild(
            a
        );

        a.click();

        document.body.removeChild(
            a
        );

        setTimeout(
            function () {

                URL.revokeObjectURL(
                    url
                );

            },
            1000
        );

    }


    /* =========================================================
       HTML2CANVAS LOADER
       The preview-to-PDF snapshot needs html2canvas. It is
       loaded from the CDN in download.html, but if that tag is
       missing or blocked, load it on demand here so the
       printed PDF always matches the on-screen preview.
       ========================================================= */

    var HTML2CANVAS_SRC =
        "https://cdn.jsdelivr.net/npm/html2canvas@1.4.1/dist/html2canvas.min.js";

    var html2canvasPromise = null;

    function ensureHtml2Canvas() {

        if (window.html2canvas) {

            return Promise.resolve(true);

        }

        if (!html2canvasPromise) {

            html2canvasPromise = new Promise(
                function (resolve) {

                    var s =
                        document.createElement(
                            "script"
                        );

                    s.src = HTML2CANVAS_SRC;

                    s.onload = function () {

                        resolve(
                            !!window.html2canvas
                        );

                    };

                    s.onerror = function () {

                        resolve(false);

                    };

                    document.head.appendChild(s);

                }
            );

        }

        return html2canvasPromise;

    }


    /* =========================================================
       RASTERIZE PREVIEW PAGE
       Renders one .preview-page DOM element (the exact HTML
       the user sees) to a canvas at full design resolution,
       so the PDF matches the preview pixel-for-pixel.
       ========================================================= */

    async function rasterizePreviewPage(
        doc,
        el
    ) {

        var pageNumber =
            Number(
                el.getAttribute(
                    "data-page"
                )
            ) || 1;

        var dims =
            pageDims(
                pageNumber === 2
            );

        var paper =
            pdfPageSize(
                dims
            );

        var scaleRatio =
            dims.w /
            (el.offsetWidth || dims.w);

        var canvas =
            await window.html2canvas(
                el,
                {
                    scale:
                        Math.max(1, scaleRatio),
                    backgroundColor:
                        "#ffffff",
                    logging:
                        false,
                    useCORS:
                        true
                }
            );

        var png =
            await doc.embedPng(
                canvas.toDataURL(
                    "image/png"
                )
            );

    function photoDataUrlKind(dataUrl) {
        var s = String(dataUrl || "");
        if (s.indexOf("data:image/png") === 0) { return "png"; }
        if (s.indexOf("data:image/jpeg") === 0 || s.indexOf("data:image/jpg") === 0) { return "jpg"; }
        return "jpg";
    }


    function dataUrlToBytes(dataUrl) {
        var s = String(dataUrl || "");
        var comma = s.indexOf(",");
        var b64 = comma >= 0 ? s.slice(comma + 1) : s;
        var bin = atob(b64);
        var len = bin.length;
        var bytes = new Uint8Array(len);
        for (var i = 0; i < len; i++) { bytes[i] = bin.charCodeAt(i); }
        return bytes;
    }



        var page =
            doc.addPage(
                [paper.w, paper.h]
            );

        page.drawImage(
            png,
            {
                x: 0,
                y: 0,
                width: paper.w,
                height: paper.h
            }
        );

    }


    /* =========================================================
       RASTERIZE PREVIEW DOCUMENT
       Builds the whole PDF from the preview DOM pages.
       Returns null when not possible (fallback to vector).
       ========================================================= */

    async function rasterizePreviewDocument(
        L
    ) {

        var els =
            Array.prototype.slice.call(
                document.querySelectorAll(
                    ".loan-preview-overlay .preview-page"
                )
            );

        if (!els.length) {

            return null;

        }

        var d =
            await L.PDFDocument.create();

        try {

            for (
                var i = 0;
                i < els.length;
                i++
            ) {

                await rasterizePreviewPage(
                    d,
                    els[i]
                );

            }

            return d;

        }

        catch (err) {

            console.warn(
                "Preview rasterization failed — using vector drawing:",
                err
            );

            return null;

        }

    }


    /* =========================================================
       GENERATE PDF
       ========================================================= */

    async function generatePDF(
        values,
        selections
    ) {

        if (!window.PDFLib) {

            alert(
                "PDF library not loaded."
            );

            return;

        }


        values =
            values || currentValues;


        selections =
            selections ||
            currentSelections;


        try {

            var L =
                window.PDFLib;


            var doc =
                await L.PDFDocument.create();


            var font =
                await doc.embedFont(
                    L.StandardFonts.Helvetica
                );

            /*
                BOLD INK — the fill view and the
                preview show values in bold, so
                the vector fallback must too.
            */

            var fontBold =
                await doc.embedFont(
                    L.StandardFonts.HelveticaBold
                );

        /* Embed the attached 2x2 photo once, then reuse it. */
        var photoBytes = null;
        var photoKind = "";
        var photoImg = null;
        if (currentPhotoDataUrl) {
            try {
                photoBytes = dataUrlToBytes(currentPhotoDataUrl);
                photoKind = photoDataUrlKind(currentPhotoDataUrl);
            } catch (pe) {
                console.error("Photo embed error:", pe);
                photoBytes = null;
                photoKind = "";
            }
            if (photoBytes) {
                try {
                    if (photoKind === "png") {
                        photoImg = await doc.embedPng(photoBytes);
                    } else {
                        try {
                            photoImg = await doc.embedJpg(photoBytes);
                        } catch (je) {
                            try { photoImg = await doc.embedPng(photoBytes); }
                            catch (pe2) { photoImg = null; }
                        }
                    }
                } catch (ee) {
                    console.error("Photo embed error:", ee);
                    photoImg = null;
                }
            }
        }


            var rgb =
                L.rgb;


            var ink =
                hexToRgb(
                    inkColor()
                );


            var images =
                cfg().images || [];


            var pages =
                hasPage2()
                    ? [1, 2]
                    : [1];


            /* =================================================
               PREFER EXACT PREVIEW SNAPSHOT
               If the preview overlay is open, render the
               preview's DOM pages directly into the PDF. This
               guarantees the print looks exactly like the
               preview (same fonts, same scaling, same
               positions). html2canvas is loaded on demand if it
               is not already present. If anything fails, fall
               back to the vector drawing below.
               ================================================= */

            var previewOverlay =
                document.getElementById(
                    "scslaiFormPreview"
                );

            var canRasterize =
                previewOverlay &&
                (await ensureHtml2Canvas());

            if (canRasterize) {

                var snapDoc =
                    await rasterizePreviewDocument(
                        L
                    );

                if (snapDoc) {

                    await savePdfDocument(
                        snapDoc,
                        values
                    );

                    return;

                }


            }


            for (
                var p = 0;
                p < pages.length;
                p++
            ) {

                var pageNumber =
                    pages[p];


                var isPage2 =
                    pageNumber === 2;


                var map =
                    isPage2
                        ? (
                            cfg().page2Fields ||
                            {}
                        )
                        : (
                            cfg().fields ||
                            {}
                        );


                var imageSrc =
                    images[
                        pageNumber - 1
                    ];


                if (!imageSrc) {

                    throw new Error(
                        "Form image not found for page " +
                        pageNumber
                    );

                }


                var img =
                    new Image();


                img.src =
                    imageSrc;


                await new Promise(
                    function (
                        resolve,
                        reject
                    ) {

                        img.onload =
                            resolve;

                        img.onerror =
                            reject;

                    }
                );


                var png;


                try {

                    var rp =
                        await fetch(
                            imageSrc
                        );


                    if (!rp.ok) {

                        throw new Error(
                            "Fetch failed"
                        );

                    }


                    png =
                        await doc.embedPng(
                            await rp.arrayBuffer()
                        );

                }

                catch (e) {

                    png =
                        await doc.embedPng(
                            img2url(img)
                        );

                }


                var dims =
                    pageDims(
                        isPage2
                    );


                var paper =
                    pdfPageSize(
                        dims
                    );


                var aw =
                    paper.w;


                var ah =
                    paper.h;


                var scale =
                    aw / dims.w;


                var page =
                    doc.addPage(
                        [aw, ah]
                    );


                /* =================================================
                   BACKGROUND
                   ================================================= */

                page.drawImage(
                    png,
                    {

                        x: 0,

                        y: 0,

                        width: aw,

                        height: ah

                    }
                );


                /* =================================================
                   TEXT
                   ================================================= */

                Object.keys(map)
                    .forEach(
                        function (id) {

                            var value =
                                values[id];


                            if (
                                value === undefined ||
                                value === null ||
                                String(value).trim() === ""
                            ) {

                                return;

                            }


                            var f =
                                map[id];


                            var text =
                                String(value);


                            /* CENTER + BOLD:
                               measure the text so it
                               can be centered inside
                               the field's box, same
                               as the on-screen view. */

                            var size =
                                fieldFS(f) * scale;

                            var tw =
                                fontBold.widthOfTextAtSize(
                                    useUpper()
                                        ? text.toUpperCase()
                                        : text,
                                    size
                                );

                            var boxW =
                                (Number(f.w) || 0) * scale;

                            var cx =
                                Number(f.x) * scale +
                                (boxW > 0
                                    ? Math.max(0, (boxW - tw) / 2)
                                    : 0);


                            page.drawText(

                                useUpper()

                                    ? text.toUpperCase()

                                    : text,

                                {

                                    x: cx,

                                    y:
                                        ah -
                                        (
                                            Number(
                                                f.y
                                            ) +
                                            fieldFS(f) *
                                            0.9
                                        ) *
                                        scale,

                                    size: size,

                                    font: fontBold,

                                    color:
                                        rgb(
                                            ink.r,
                                            ink.g,
                                            ink.b
                                        )

                                }

                            );

                        }
                    );


                /* =================================================
                   CHECKBOXES
                   ================================================= */

                if (
                    !isPage2 &&
                    hasBoxes()
                ) {

                    var cbMap =
                        cfg().checkboxes ||
                        {};


                    Object.keys(cbMap)
                        .forEach(
                            function (id) {

                                if (
                                    !selections[id]
                                ) {

                                    return;

                                }


                                var c =
                                    cbMap[id];


                                var cx =
                                    Number(
                                        c.cx
                                    );


                                var cy =
                                    Number(
                                        c.cy
                                    );


                                var cw =
                                    Number(
                                        c.w
                                    );


                                var ch =
                                    Number(
                                        c.h
                                    );


                                var xc =
                                    cx * scale;


                                var yc =
                                    ah -
                                    cy * scale;


                                var size =
                                    Math.min(
                                        cw,
                                        ch
                                    ) *
                                    0.55 *
                                    scale;


                                page.drawLine({

                                    start: {

                                        x:
                                            xc -
                                            size,

                                        y:
                                            yc -
                                            size

                                    },

                                    end: {

                                        x:
                                            xc +
                                            size,

                                        y:
                                            yc +
                                            size

                                    },

                                    thickness:
                                        1.5 *
                                        scale,

                                    color:
                                        rgb(
                                            ink.r,
                                            ink.g,
                                            ink.b
                                        )

                                });


                                page.drawLine({

                                    start: {

                                        x:
                                            xc -
                                            size,

                                        y:
                                            yc +
                                            size

                                    },

                                    end: {

                                        x:
                                            xc +
                                            size,

                                        y:
                                            yc -
                                            size

                                    },

                                    thickness:
                                        1.5 *
                                        scale,

                                    color:
                                        rgb(
                                            ink.r,
                                            ink.g,
                                            ink.b
                                        )

                                });

                            }
                        );

                }

                /* ATTACHED 2x2 PHOTO (page 1 only, vector fallback path) */
                if (!isPage2 && photoImg && hasPhotoBox()) {
                    try {
                        var fphb = getPhotoBox();
                        var fphw = (Number(fphb.w) || 0) * scale;
                        var fphh = (Number(fphb.h) || 0) * scale;
                        var fphx = (Number(fphb.x) || 0) * scale;
                        var fphy = ah - (((Number(fphb.y) || 0) + (Number(fphb.h) || 0)) * scale);
                        page.drawImage(photoImg, {
                            x: fphx, y: fphy, width: fphw, height: fphh
                        });
                    } catch (fpe) {
                        console.error("Photo draw error:", fpe);
                    }
                }



            }


            /* =================================================
               SAVE PDF
               ================================================= */

            await savePdfDocument(
                doc,
                values
            );

        }

        catch (err) {

            console.error(
                "PDF generation error:",
                err
            );


            alert(

                "PDF generation failed: " +

                (
                    err &&
                    err.message
                        ? err.message
                        : err
                )

            );

        }

    }


    /* =========================================================
       SUBMIT FORM
       ========================================================= */

    function wireSubmit() {

        var form =
            document.getElementById(
                "loanApplicationForm"
            );


        if (!form) {

            console.warn(
                "loanApplicationForm not found."
            );

            return;

        }


        /*
         * Prevent duplicate submit listeners.
         */

        if (
            form.dataset.submitBound === "true"
        ) {

            return;

        }


        form.dataset.submitBound =
            "true";


        form.addEventListener(
            "submit",
            function (e) {

                e.preventDefault();

                e.stopPropagation();


                console.log(
                    "Loan form submitted."
                );


                /* =================================================
                   COLLECT VALUES
                   ================================================= */

                var vals =
                    collectValues();


                console.log(
                    "Collected values:",
                    vals
                );


                var miss = [];


                /* =================================================
                   CUSTOM VALIDATION
                   ================================================= */

                if (
                    typeof cfg().validate ===
                    "function"
                ) {

                    try {

                        cfg().validate(
                            vals,
                            miss
                        );

                    }

                    catch (err) {

                        console.error(
                            "Validation error:",
                            err
                        );


                        alert(
                            "There was an error validating the form."
                        );


                        return;

                    }

                }


                /* =================================================
                   CHECKBOX VALIDATION
                   ================================================= */

                var cbm =
                    cfg().checkboxes ||
                    {};


                var hasRegular =
                    false;


                var hasSpecial =
                    false;


                var hasApplication =
                    false;


                Object.keys(cbm).forEach(
                    function (key) {

                        var category =
                            cbm[key].category;


                        if (
                            category ===
                            "regular"
                        ) {

                            hasRegular =
                                true;

                        }


                        if (
                            category ===
                            "special"
                        ) {

                            hasSpecial =
                                true;

                        }


                        if (
                            category ===
                            "application"
                        ) {

                            hasApplication =
                                true;

                        }

                    }
                );


                var regs =
                    checkedOf(
                        "regular"
                    );


                var specs =
                    checkedOf(
                        "special"
                    );


                var apps =
                    checkedOf(
                        "application"
                    );


                var totalLoanSelections =
                    regs.length +
                    specs.length;


                if (
                    hasRegular ||
                    hasSpecial
                ) {

                    if (
                        totalLoanSelections === 0
                    ) {

                        miss.push(
                            "Please select a Loan Type or Special Loan."
                        );

                    }


                    if (
                        totalLoanSelections > 1
                    ) {

                        miss.push(
                            "Please select only ONE Loan Type or Special Loan."
                        );

                    }

                }


                /* =================================================
                   APPLICATION TYPE
                   ================================================= */

                if (
                    hasApplication &&
                    apps.length === 0
                ) {

                    miss.push(
                        "Application Type"
                    );

                }


                /* =================================================
                   EDP NUMBER
                   ================================================= */

                if (
                    vals.edpNumber &&
                    !/^[0-9]+$/.test(
                        vals.edpNumber
                    )
                ) {

                    alert(
                        "EDP Number must contain numbers only."
                    );

                    return;

                }


                /* =================================================
                   ZIP CODE
                   ================================================= */

                if (
                    vals.zipCode &&
                    !/^[0-9]{4}$/.test(
                        vals.zipCode
                    )
                ) {

                    alert(
                        "Please enter a valid 4-digit ZIP Code."
                    );

                    return;

                }


                /* =================================================
                   MOBILE NUMBER
                   ================================================= */

                var mobile =
                    cfg().mobileField

                        ? vals[
                            cfg().mobileField
                        ]

                        : vals.contactNumber;


                var mob =
                    mobile

                        ? String(
                            mobile
                        ).replace(
                            /[\s-]/g,
                            ""
                        )

                        : "";


                if (
                    mob &&
                    !/^(09|\+639)[0-9]{9}$/.test(
                        mob
                    )
                ) {

                    alert(
                        "Please enter a valid Philippine mobile number."
                    );

                    return;

                }


                /* =================================================
                   EMAIL
                   ================================================= */

                if (
                    vals.emailAddress &&
                    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
                        vals.emailAddress
                    )
                ) {

                    alert(
                        "Please enter a valid email address."
                    );

                    return;

                }


                /* =================================================
                   BIRTHDATE
                   ================================================= */

                if (
                    vals.birthdate
                ) {

                    var birth =
                        new Date(
                            vals.birthdate +
                            "T00:00:00"
                        );


                    var today =
                        new Date();


                    today.setHours(
                        0,
                        0,
                        0,
                        0
                    );


                    if (
                        isNaN(
                            birth.getTime()
                        ) ||
                        birth >= today
                    ) {

                        alert(
                            "Birthdate cannot be today or a future date."
                        );

                        return;

                    }

                }


                /* =================================================
                   REQUIRED FIELDS
                   ================================================= */

                if (
                    miss.length > 0
                ) {

                    alert(

                        "Please complete:\n\n- " +

                        miss.join(
                            "\n- "
                        )

                    );

                    return;

                }


                /* =================================================
                   GET RESULT
                   ================================================= */

                var result;


                try {

                    if (
                        typeof cfg().getResult ===
                        "function"
                    ) {

                        result =
                            cfg().getResult(
                                vals,
                                checkedOf
                            );

                    }

                    else {

                        result = {

                            form:
                                active,

                            fields:
                                vals

                        };

                    }

                }

                catch (err) {

                    console.error(
                        "getResult error:",
                        err
                    );


                    alert(
                        "Unable to process the loan application."
                    );


                    return;

                }


                /* =================================================
                   ENSURE OBJECT
                   ================================================= */

                if (
                    !result ||
                    typeof result !== "object"
                ) {

                    result = {

                        form:
                            active,

                        fields:
                            vals

                    };

                }


                /* =================================================
                   SAVE RADIO VALUES
                   ================================================= */

                result.checkboxValues =
                    {};


                Object.keys(cbm)
                    .forEach(
                        function (id) {

                            var el =
                                document.getElementById(
                                    id
                                );


                            result.checkboxValues[id] =
                                !!(
                                    el &&
                                    el.checked
                                );

                        }
                    );


                /* =================================================
                   SAVE CURRENT DATA
                   ================================================= */

                currentValues =
                    Object.assign(
                        {},
                        vals
                    );


                currentSelections =
                    Object.assign(
                        {},
                        result.checkboxValues
                    );


                window.__loanApplicationData =
                    result;


                console.log(
                    "Loan data:",
                    result
                );


                /* =================================================
                   CLOSE FORM
                   ================================================= */

                closeModal();


                /* =================================================
                   OPEN PREVIEW
                   ================================================= */

                setTimeout(
                    function () {

                        showPreview(
                            currentValues,
                            currentSelections
                        );

                    },
                    100
                );

            }
        );

    }


    /* =========================================================
       INITIALIZATION
       ========================================================= */

    function init() {

        modal =
            document.getElementById(
                "loanModal"
            );


        body =
            document.body;


        closeBtn =
            document.getElementById(
                "closeLoanModal"
            );


        if (!modal) {

            console.warn(
                "#loanModal not found."
            );

        }


        bindButtons();


        wireSubmit();


        /* =================================================
           CLOSE BUTTON
           ================================================= */

        if (closeBtn) {

            closeBtn.addEventListener(
                "click",
                closeModal
            );

        }
        /* =================================================
           ESCAPE KEY
           ================================================= */

        document.addEventListener(
            "keydown",
            function (e) {

                if (
                    e.key === "Escape" &&
                    modal &&
                    modal.classList.contains(
                        "active"
                    )
                ) {

                    closeModal();

                }

            }
        );

    }


    /* =========================================================
       PUBLIC API
       ========================================================= */

    window.SCSLAI = {

        register:
            register

    };


    /* =========================================================
       START
       ========================================================= */

    if (
        document.readyState ===
        "loading"
    ) {

        document.addEventListener(
            "DOMContentLoaded",
            init
        );

    }

    else {

        init();

    }


})();