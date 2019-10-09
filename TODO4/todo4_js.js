function saveState() {

    let notReady = [];
    let ready = [];

    $('#list-not-ready li.task span').each(function(i, el) {
        let val = encodeURI($(el).text());
        notReady.push(val);
    });

    $('#list-ready li.task span').each(function(i, el) {
        let val = encodeURI($(el).text());
        ready.push(val);
    });

    let result = notReady.join('&') + '|' + ready.join('&');

    let time = new Date();
    time.setTime(time.getTime() + 2678400000);
    document.cookie = "data=" + result + "; path=/ " + "; expires=" + time.toGMTString();
    console.log(document.cookie = "data=" + result + "; path=/ " + "; expires=" + time.toGMTString())
}

function loadState() {

    let addList = function(strList, isComplete) {

        let list = strList.split('&');
        console.log(list);

        for (let i = 0; i < list.length; i++) {
            if (list[i]) {
                addTask(decodeURI(list[i]), isComplete);
            }
        }
    }


    var getCookie = function(name) {
        let cSIndex = document.cookie.indexOf(name);
        if (cSIndex == -1) {
            return ''
        };

        cSIndex = document.cookie.indexOf(name + "=")
        if (cSIndex == -1) {
            return ''
        };

        let cEIndex = document.cookie.indexOf(";", cSIndex + (name + "=").length);
        if (cEIndex == -1) {
            cEIndex = document.cookie.length;
        }

        return document.cookie.substring(cSIndex + (name + "=").length, cEIndex);
    }

    var parts = getCookie('data').split('|');

    console.log("Загрузка сосотояния ");


    let removeList = function(isComplete) {

        let container = isComplete ? '#list-ready' : '#list-not-ready';
        let taskList = $(container).find('.task');

        console.log(taskList);
        taskList.each((i, task) => $(task).remove());
    }

    if (parts[0] != "") {
        addList(parts[0], false);
        $("#counter-not-ready-value").text((parts[0].split('&')).length);
    }
    if (parts.length > 1) {
        if (parts[1] != "") {
            addList(parts[1], true);
            $("#counter-ready-value").text((parts[1].split('&')).length);
        }
    }

}

function moveTask(li, isComplete) {
    let container = isComplete ? '#list-ready' : '#list-not-ready';

    let checkedFilterBoxes = $('.btn-check-list input');
    console.log(checkedFilterBoxes);

    // checkedFilterBoxes.filter((i, el) => {$(el).prop('checked') === false;});

    // Отслеживание изменения флага отображения при переносе задачи из одного в другой список
    // Смотрим флажок, запрещающий отображение соответствующего списка
    let forbiddenCheckBoxForContainer = isComplete ? '#check-list-not-ready' : '#check-list-ready';
    let isForbiddenChecked = $(forbiddenCheckBoxForContainer).prop('checked');
    console.log(isForbiddenChecked);
    if (isForbiddenChecked) {
        li.attr('data-showed', false);
        $(li).css('display', 'none');
    }

    li.appendTo(container);
    saveState();
}


function changeCounter(li, changeValue) {

    let list = li.parent('.list');
    console.log(li.parent('.list'));

    let counter;
    if (list.attr('id') == 'list-ready') counter = $("#counter-ready-value");
    if (list.attr('id') == 'list-not-ready') counter = $("#counter-not-ready-value");


    console.log(counter);
    let value = +escape($(counter).text());
    console.log(value);

    if (value + changeValue > 0) $(counter).text((value + changeValue));
    else $(counter).text("0");

    setAllCounter();
}

function setAllCounter() {
    let readyCounterValue = +$("#counter-ready-value").text();
    let notReadyCounterValue = +$("#counter-not-ready-value").text();
    let allCounter = $("#counter-all-value");

    allCounter.text((readyCounterValue + notReadyCounterValue));
}


function addTask(val, isComplete) {

    let span = $('<span contenteditable="true" />').text(val);
    let cb = $('<input type="checkbox" class="sbtn-check" />');
    let del = $('<a class="del" href="#" />').text('×');
    let p = $('<p/>')
    let li = $('<li class="task" data-showed="true"/>').append(p).append(del).append(cb).append(span); //

    cb.click(function() {

        changeCounter(li, -1);

        moveTask(li, cb.prop('checked'));
        changeCounter(li, 1);


        checkPagPageCount(getCurrentPagPageNumber());

    }).prop('checked', isComplete);

    del.click(function() {

        changeCounter(li, -1);

        li.remove();


        saveState();
        checkPagPageCount(getCurrentPagPageNumber());
        return false;
    });

    moveTask(li, isComplete);
    return li;

}

function addPagPage(isActive) {

    let pagContainer = $('.pagination');

    let pageNumber = pagContainer.find('li').length + 1;

    console.log(pagContainer.find('li'));
    console.log(pagContainer);


    let page = $('<a class="page-link" href="#"></a>');
    let span = $('<span />');
    page.text(pageNumber);
    let li_pag = isActive ? $('<li class="page-item active" />').append(span).append(page) : $('<li class="page-item" />').append(span).append(page);


    li_pag.appendTo(pagContainer);

    li_pag.click(function() {
        // Функция обновления списка для отображения нужных элементов
        getTasksForPagPage(pageNumber);
        setPageActive(li_pag);

    });

}

function setPageActive(li_pag) {

    console.log($('.page-item, active'));
    $('.page-item, active').removeClass('page-item active').addClass('page-item');
    $(li_pag).removeClass('page-item').addClass('page-item active');
}


function getTasksForPagPage(pageNumber) {
    let elementsOnPageCount = +$('#screen-elements-count-value').text();


    let startNumber = (pageNumber - 1) * elementsOnPageCount;
    let endNumber = pageNumber * elementsOnPageCount - 1;


    let showedCheckedTasks = $('.task').filter('[data-showed = true]');
    let showedTasksCount = showedCheckedTasks.length;

    showedCheckedTasks.each((i, el) => {
        if (i >= startNumber && i <= endNumber) $(el).css('display', 'list-item');
        else $(el).css('display', 'none');
    });


    console.log(elementsOnPageCount, pageNumber, showedTasksCount);
    console.log(showedCheckedTasks.filter('[display = list-item]').length);

    let numberOfAdditionalPages = Math.ceil(showedTasksCount / elementsOnPageCount) - pageNumber;
    console.log(numberOfAdditionalPages);
}


function changePagPageCount(numberOfAdditionalPages) {
    for (let i = 0; i < Math.abs(numberOfAdditionalPages); i++) {
        if (numberOfAdditionalPages >= 0) addPagPage(false);
        if (numberOfAdditionalPages < 0) removePagPage();
    }
}


function removePagPage() {
    let pagContainer = $('.pagination');

    console.log(pagContainer);
    if (pagContainer.find('li').length > 1) pagContainer.find('li').last().remove();
}


function checkPagPageCount(pageNumber) {

    let elementsOnPageCount = +$('#screen-elements-count-value').text();

    console.log($('.pagination'));

    let pagPageCount = $('.pagination').find('li').length;

    let showedTasksCount = +$('.task').filter('[data-showed = true]').length;


    if (showedTasksCount == 0) $('.pagination').find('li:first').css('display', 'none');
    else $('.pagination').find('li:first').css('display', 'inline');

    console.log(elementsOnPageCount, pagPageCount, showedTasksCount);

    let numberOfAdditionalPages = Math.ceil(showedTasksCount / elementsOnPageCount) - pagPageCount;
    console.log(numberOfAdditionalPages);

    changePagPageCount(numberOfAdditionalPages);

    // Перенести в функцию установки настроек сраницы
    getTasksForPagPage(pageNumber);

    let current_pag_page = ($('.pagination').find('li')).eq(pageNumber - 1);

    console.log(current_pag_page);
    setPageActive(current_pag_page);
}

function getCurrentPagPageNumber() {

    let pages = $('.pagination').find('li');
    let current_pag_page = $('.active');

    console.log(current_pag_page);
    curr_pageNumber = $(pages).index(current_pag_page);
    return curr_pageNumber + 1;
}



$(function() {

    $('#btn-enter').click(function() {
        let val = $('#new-todo').val();
        if (val) {
            console.log(val);
            let li = addTask(val);
            changeCounter(li, 1);

            $('#new-todo').val('');
        }

        checkPagPageCount(getCurrentPagPageNumber());
        return false;
    });

    $('#new-todo').keypress(function(e) {
        if (e.keyCode == 13) {
            $('#btn-enter').click();
        }
    });

    // $('#list-not-ready').sortable({ deactivate: saveState }); // после перетаскивания сохраняем состояние в куках

    $('#btn-remove-all').click(function() {
        $('#list-ready').empty();
        $('#list-not-ready').empty();

        $("#counter-ready-value").text("0");
        $("#counter-not-ready-value").text("0");


        saveState();
        setAllCounter();
        checkPagPageCount(1);
        return false;
    });

    $('#btn-remove-completed').click(function() {
        $('#list-ready').empty();

        $("#counter-ready-value").text("0");

        saveState();
        setAllCounter();
        checkPagPageCount(1);
        return false;
    });



    function IsDisplayed(IsChecked) {
        return IsChecked ? 'list-item' : 'none';
    }


    $('.btn-check-list input').click(function() {

        clickedCheckBox = $(this);
        console.log(this);
        let IsChecked = clickedCheckBox.prop('checked');
        console.log(clickedCheckBox.attr('id'));

        if (IsChecked == false) clickedCheckBox.prop('checked', true);
        else {
            let otherCheckBoxes = $('.btn-check-list input').filter((i, el) => $(el).attr('id') != clickedCheckBox.attr('id'));
            console.log(otherCheckBoxes);

            otherCheckBoxes.each((i, el) => { $(el).prop('checked', false); })


            if (clickedCheckBox.attr('id') == 'check-list-not-ready') {
                $("#list-not-ready").find("li").each((i, el) => {
                    el.setAttribute('data-showed', IsChecked);
                });
                $("#list-ready").find("li").each((i, el) => {
                    el.setAttribute('data-showed', !IsChecked);
                    $(el).css('display', 'none');
                });
            }
            if (clickedCheckBox.attr('id') == 'check-list-ready') {
                $("#list-ready").find("li").each((i, el) => {
                    el.setAttribute('data-showed', IsChecked);
                });
                $("#list-not-ready").find("li").each((i, el) => {
                    el.setAttribute('data-showed', !IsChecked);
                    $(el).css('display', 'none');
                });
            }
            if (clickedCheckBox.attr('id') == 'check-list-all') {

                otherCheckBoxes.each((i, l) => {
                    $("#list-not-ready").find("li").each((k, el) => {
                        el.setAttribute('data-showed', true);
                        console.log(el);
                    });
                    $("#list-ready").find("li").each((k, el) => {
                        el.setAttribute('data-showed', true);
                        console.log(el);
                    });

                    // otherCheckBoxes.each((i, l) => { 
                    // 	$(l).find("li").each( (k, el) => {
                    // 		el.setAttribute('data-showed', true);
                    // 		console.log(el);
                    // 	    //$(el).css('display', 'inline-block');
                    //	});

                });
            };
        }

        checkPagPageCount(1);
        console.log(clickedCheckBox);
        console.log(IsChecked);

    });


    let oldValue;

    $("#screen-elements-count-value").click(function() {
        let currentValue = ($('#screen-elements-count-value').text());

        $("#screen-elements-count-value").blur(function() {
            let value = $('#screen-elements-count-value').text();
            if (!isNaN(value)) {

                if (value == 0) $('#screen-elements-count-value').text(currentValue);
                currentValue = ($('#screen-elements-count-value').text());
                checkPagPageCount(1);
            } else {
                $('#screen-elements-count-value').text(currentValue);
            }


        });
    });

    addPagPage(true);
    loadState();
    setAllCounter();
    $('#check-list-all').click();
})