from django import forms

class JSONUploadForm(forms.Form):
    json_file = forms.FileField(
        label="Upload JSON File",
        required=True,
        widget=forms.ClearableFileInput(attrs={'accept': 'application/json'}),
    )
