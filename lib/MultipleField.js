(function () {
    var instances = {};
    var MultipleField = function (placeHolder, template) {
        var events = {};
        var $elem = $(placeHolder);
        var $template;
        $template = template ? $(template) : $elem.find(".InputField:first");
        if (!$template.length)
            throw ("Template Not Found");

        assignEvents($elem, $template);

        $template = $template.clone();

        function assignEvents($container, $element) {
            assignRemoveEvent($element);
            assignAddEvent($container);
        }

        function assignRemoveEvent($elem) {
            $elem.find(".RemoveField").click(function () {
                removeField($elem);
            });
        }

        function assignAddEvent($elem) {
            $elem.find(".AddField").click(function () {
                addField($elem);
            });
        }

        function addField($elem) {
            var $newKeywordElement = $template.clone();
            assignEvents($newKeywordElement, $newKeywordElement);
            var $lastKeyWord = $elem.find(".InputField:last");
            if ($lastKeyWord.length)
                $lastKeyWord.after($newKeywordElement);
            else
                $elem.prepend($newKeywordElement);

            emitEvent("fieldAdd", { element: $newKeywordElement });

            return $newKeywordElement;
        }

        function removeField($elem) {
            $elem.remove();
            emitEvent("fieldRemove", { element: $elem });
        }
        function getFieldValues($elem) {
            return $elem.children().find("input:text").map(
                   function (i, e) {
                       return $(e).val();
                   }).toArray();
        }

        function addEventHandler(eventName, func) {
            if (events[eventName])
                events[eventName].push(func);
            else
                events[eventName] = [func];
            return func;
        }

        function removeEventHandler(eventName, func) {
            if (typeof (func) === 'function') {

                var indexOfEventInEventsArray = events[eventName].indexOf(func);
                if (indexOfEventInEventsArray > -1) {
                    events[eventName].splice(indexOfEventInEventsArray, 1);
                    return;
                }
                throw ("No such function is subscribed as an event");
            }
            throw ("Expected a function");
        }

        function emitEvent(eventName, eventParams) {
            var eventsToEmit = events[eventName];
            if (eventsToEmit) {
                eventsToEmit.forEach(function (func) {
                    if (eventParams)
                        func(eventParams);
                    else
                        func();
                });
            }
        }

        return {
            add: function () {
                return addField($elem);
            },
            getValues: function () {
                return getFieldValues($elem);
            },
            on: function (eventName, func) {
                if (typeof (eventName) === 'string') {
                    if (typeof (func) === 'function') {
                        return addEventHandler(eventName, func);
                    }
                    return {
                        remove: function (func) {
                            removeEventHandler(eventName, func);
                        }
                    }
                }
                else {
                    throw ("Expected a string as event name");
                }
            },
        }
    }

    MultipleField.instances = function (id) {
        if (id != undefined)
            return instances[id];
        else {
            return instances;
        }
    }

    jQuery.fn.extend({
        multipleField: function () {
            var res = [];
            $(this).each(function () {
                var newField = new MultipleField(this);
                instances[$(this).attr('id')] = newField;
                res.push(newField);
            });
            return $(res);
        }
    });

    jQuery.multipleField = MultipleField;

    $(function () {
        $(".MultipleField").multipleField();
    });

})()