$(document).ready(function(){

var selects = $(".chosen-ajax");
    $(selects).each(function () {
        var $this = $(this),
            id = $(this).attr("name");

        if ($this.attr('multiple')) {
            $this.on('change', function () {
                var $t = $(this);
                if (!$t.val()) {
                    $t.val('');
                }
            });
        }

        $(this).ajaxChosen({
            type: "GET",
            url: global.URL["GetData"],
            data: { id: id },
            jsonTermKey: "query",
            dataType: "json"
        }, null, { width: "100%", placeholder_text_single: "Selecione..." });

        $(this).trigger("chosen:update");
    });
});