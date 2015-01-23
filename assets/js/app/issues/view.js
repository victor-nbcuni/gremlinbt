/**
 * @author          Victor Lantigua
 * @description     This file should be included in the issue view page.
 */

/**
 * Lazy Loading Comments Class
 */
var LazyComments = {
    perPage: 5,         // The number of comments to load per request
    currentPage: 1,     // The current page
    numAdded: 0,        // Keeps track of the number of comments just added
    issueId: null,

    init: function(issueId) {
        var self = this;
        self.issueId = issueId;

        // Bind form submit handler
        $('#comments-form').on('submit', function() {
            event.preventDefault();
            self.addComment($(this));
        });

        // Bind show more button click handler
        $('#btn-show-more').on('click', function() {
            self.lazyLoad($(this));
        });

        // Bind edit button
        $('#comments-list').on('click', '.btn-edit-comment', function(event) {
            event.stopPropagation();
            event.preventDefault();
            var $comment = $(this).parent().siblings('.comment');
            $comment.editable({
                //selector: '.editable',
                type: 'textarea',
                name: 'comment',
                toggle: 'manual',
                ajaxOptions: {
                    type: 'POST'
                }
            });
            $comment.editable('show');
        });

        // Bind delete button
        $('#comments-list').on('click', '.btn-remove-comment', function(event) {
            event.preventDefault();
            if (confirm("Are you sure you want to remove this comment?")) {
                $.post('/issue_comments/update/' + $(this).attr('data-id'), {name: 'archived', value: 1});
                $(this).parent().closest('.media').fadeOut();
            }
        });
    },

    /**
     * Loads more comments
     */
    lazyLoad: function(showMoreBtn) {
        var self = this;
        showMoreBtn.attr('disabled', true).text('Loading...');

        $.ajax({
            url: '/issue_comments',
            type: 'GET',
            data: {
                issue_id: self.issueId,
                limit: self.perPage,
                offset: self.numAdded + (self.currentPage * self.perPage)
            }
        }).done(function(html) {
            self.currentPage++;

            if (html.length > 0) {
                // Show comments
                $('#comments-list').append(html);
                showMoreBtn.attr('disabled', false).text('Show More');
            }
            else {
                // No more comments to show, hide button.
                showMoreBtn.hide();
            }
        }).fail(function(data) {
            var data = JSON.parse(data.responseText);
            showMoreBtn.attr('disabled', false).text('Show More');
            alert('Error: ' + data.error_message);
        });
    },

    /**
     * Submits a new comment
     */
    addComment: function(form) {
        var self = this,
            submitBtn = form.find('button[type=submit]').attr('disabled', true);

        $.ajax({
            url: '/issue_comments/create',
            type: 'POST',
            data: form.serialize()
        }).done(function(data) {
            form[0].reset();
            submitBtn.attr('disabled', false);
            self.numAdded++;

            if ($('#comments-list').find('.media').length) {
                // Add it to the top of the list.
                $('#comments-list').prepend(data);
            }
            else {
                // First comment, replace empty text with comment.
                $('#comments-list').html(data);
            } 
        }).fail(function(data) {
            var data = JSON.parse(data.responseText);
            submitBtn.attr('disabled', false);
            alert('Error: ' + data.error_message);
        });
    }
};

/**
 * X-Editable Fields Class
 */
var EditableFields = {
    init: function(issueId) {
        var self = this;

        $.fn.editable.defaults.mode = 'popup';
        $.fn.editableform.buttons = '<button type="submit" class="btn btn-primary editable-submit"><i class="fa fa-check"></i></button><button type="button" class="btn btn-default editable-cancel"><i class="fa fa-close"></i></button>';
        
        $('#summary').editable({
            url: '/issues/update_editable_field',
            type: 'textarea',
            pk: issueId,
            name: 'summary',
            ajaxOptions: {
                type: 'POST'
            }
        });

        $('#description').editable({
            url: '/issues/update_editable_field',
            type: 'textarea',
            pk: issueId,
            name: 'description',
            ajaxOptions: {
                type: 'POST'
            }
        });

        $('#priority_id').editable({
            url: '/issues/update_editable_field',
            type: 'select',
            pk: issueId,
            name: 'priority_id',
            ajaxOptions: {
                type: 'POST'
            }, 
            source: '/issues/priority_options/' + issueId,
            sourceCache: true          
        });

        $('#status_id').editable({
            url: '/issues/update_editable_field',
            type: 'select',
            pk: issueId,
            name: 'status_id',
            ajaxOptions: {
                type: 'POST'
            }, 
            source: '/issues/status_options/' + issueId,
            sourceCache: false
        });

        /*$('#assigned_department_id').editable({
            url: '/issues/update_editable_field',
            type: 'select',
            pk: issueId,
            name: 'assigned_department_id',
            ajaxOptions: {
                type: 'POST'
            }, 
            source: dataSources.departments
        });*/

        $('#type_id').editable({
            url: '/issues/update_editable_field',
            type: 'select',
            pk: issueId,
            name: 'type_id',
            ajaxOptions: {
                type: 'POST'
            }, 
            source: '/issues/type_options/' + issueId,
            sourceCache: true        
        });
    }
}