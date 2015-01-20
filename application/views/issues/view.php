<section class="content-header">
    <h1>
        <i class="fa fa-bug"></i> <?php echo Text::limit_chars($issue->summary, 40); ?>
        <small><?php echo $issue->trackingCode(); ?></small>
    </h1>
</section>

<section class="content page-view-issue">
    <div class="row">
        <div class="col-xs-12">
            <h4 class="page-header">Details</h4>

            <div class="row" style="margin-bottom: 6px;">
                <div class="col-xs-2 text-muted">Type:</div> <div class="col-xs-2"><span id="type_id" data-value="<?php echo $issue->type_id; ?>"><?php echo $issue->type->name; ?></span></div><div class="col-xs-2 text-muted">Status:</div> <div class="col-xs-2"><span class="label" id="status_id" style="background: <?php echo $issue->status->color; ?>" data-value="<?php echo $issue->status_id; ?>"><?php echo $issue->status->name; ?></span></div>
            </div>

            <div class="row" style="margin-bottom: 6px;">
                <div class="col-xs-2 text-muted">Project:</div> <div class="col-xs-2"><?php echo $issue->project->name; ?></div> <div class="col-xs-2 text-muted">Priority:</div> <div class="col-xs-2"><span id="priority_id" data-value="<?php echo $issue->priority_id; ?>"><?php echo $issue->priority->name; ?></span></div>
            </div>

            <div class="row" style="margin-bottom: 6px;">
                <div class="col-xs-2 text-muted">Reporter:</div> <div class="col-xs-2"><?php echo $issue->reporter->name; ?></div> <div class="col-xs-2 text-muted">Assignee:</div> <div class="col-xs-2"><span id="assigned_department_id"><?php echo $issue->assigned_department->name; ?></span></div>
            </div>

            <div class="row">
                <div class="col-xs-2 text-muted">Created:</div> <div class="col-xs-2"><?php echo $issue->created_at; ?></div>  <div class="col-xs-2 text-muted">Updated:</div> <div class="col-xs-2"><?php echo $issue->updated_at; ?></div> 
            </div>

            <h4 class="page-header">Summary</h4>

            <div class="row">
                <div class="col-xs-12"><span id="summary"><?php echo $issue->summary; ?></span></div>
            </div>

            <br>

            <h4 class="page-header">Description</h4>

            <div class="row">
                <div class="col-xs-12"><span id="description"><?php echo $issue->description; ?></span></div>
            </div>

            <br>

            <?php include Kohana::find_file('views', 'issues/_view_attachments'); ?>
            
            <?php include Kohana::find_file('views', 'issues/_view_comments'); ?>
        </div>
    </div>
</section>

<script src="/assets/js/app/issues/view.js"></script>
<script>
$(function() {
    // Bind fancybox
    $('.fancybox').fancybox({
        openEffect  : 'none',
        closeEffect : 'none'
    });

    // Bind Dropzone
    Dropzone.autoDiscover = false; // Disabling autoDiscover, otherwise Dropzone will try to attach twice.
    var dropzone = new Dropzone('.dropzone', {
        url: '/issue_files/upload/<?php echo $issue->id; ?>', 
        acceptedFiles: 'image/jpeg, image/jpg, image/png, image/gif',
        maxFilesize: 4, // MB
        maxFiles: 3,
        addRemoveLinks: false,
        autoProcessQueue: true,
        previewTemplate: '<div class="dz-preview dz-file-preview">' + 
              '<div class="dz-details">' +
                '<div class="dz-filename"><span data-dz-name></span></div>' +
                '<div class="dz-size" data-dz-size></div>' +
                '<img data-dz-thumbnail />' +
              '</div>' + 
              '<div class="dz-progress"><span class="dz-upload" data-dz-uploadprogress></span></div>' +
              '<div class="dz-success-mark"><span>✔</span></div>' +
              '<div class="dz-error-message"><span data-dz-errormessage></span></div>' +
            '</div>'
    });


    // Bind attachment remove button
    $('.btn-remove-attachment').click(function() {
        event.preventDefault();
        var self = $(this);
        if (confirm("Are you sure you want to delete this attachment?")) {
            $.get(self.attr('href'));
            self.parent().parent().fadeOut('normal', function() {
                $(this).remove();
            });
        }
    });

    var issueId = '<?php echo $issue->id; ?>';

    var dataSources = {
        //departments: "<?php echo Helper_View_Issues_View::getEditableSelectSource('Department'); ?>",
        issue_priorities: "<?php echo Helper_View_Issues_View::getEditableSelectSource('Issue_Priority'); ?>",
        issue_statuses: "<?php echo Helper_View_Issues_View::getEditableSelectSource('Issue_Status'); ?>",
        issue_types: "<?php echo Helper_View_Issues_View::getEditableSelectSource('Issue_Type'); ?>",
    }

    EditableFields.init(issueId, dataSources);
    LazyComments.init(issueId);
});
</script>