from django import forms
from .models import Post, Comment
from django.contrib.auth.forms import  UserCreationForm , AuthenticationForm


class RegistrationForm(UserCreationForm):
    username = forms.CharField(max_length=30, widget=forms.TextInput
    (attrs={'placeholder':'Username','class':'form-control','autofocus':'on','required':'true','autocomplete':'username'}))
    password1 = forms.CharField(max_length=30,
    widget=forms.PasswordInput(attrs={'placeholder':'Password','class':'form-control','autocomplete':'password'}))
    password2 = forms.CharField(max_length=30,
    widget=forms.PasswordInput(attrs={'placeholder':'Confirm Password','class':'form-control','autocomplete':'password'}))

class LoginForm(AuthenticationForm):
    username = forms.CharField(max_length=30,
    widget=forms.TextInput(attrs={'placeholder':'Username','class':'form-control','autocomplete':'username'}))
    password = forms.CharField(max_length=30,
    widget=forms.PasswordInput(attrs={'placeholder':'Password','class':'form-control','autocomplete':'password'}))

    def confirm_login_allowed(self, user):
        if not user.is_active:
            raise forms.ValidationError("This user is inactive")


class PostForm(forms.ModelForm):
    class Meta:
        model = Post
        fields = ['image', 'caption']

class CommentForm(forms.ModelForm):
    class Meta:
        model = Comment
        fields = ['text']

