from django.contrib import messages
from django.contrib.auth import login , logout
from django.shortcuts import redirect, render
from accounts.forms import RegistrationForm, LoginForm
from django.contrib.auth.decorators import login_required
from .models import Post
from .forms import PostForm, CommentForm


def register_view(request):
    form = RegistrationForm(request.POST or None)

    if request.method == "POST":
        if form.is_valid():
            user = form.save()
            login(request, user)
            messages.success(request, 'Account created successfully')
            return redirect('login_view')
        else:
            messages.error(request, '')
    return render(request, 'register.html' , {'form':form , 'title':'Register'})


def login_view(request):
    storage = messages.get_messages(request)
    list(storage)

    form = LoginForm(request, data=request.POST or None)

    if request.method == "POST":
        if form.is_valid():
            user = form.get_user()
            login(request, user)
            messages.success(request, "Login successful")
            return redirect('welcome_view')  # ✅ FIXED: redirect instead of render
        else:
            messages.error(request, "Invalid username or password")

    return render(request, 'login.html', {'form': form, 'title': 'Login'})


def logout_view(request):
    logout(request)
    storage = messages.get_messages(request)
    list(storage)  # Clear any old messages
    messages.success(request, "Logout successful")
    return redirect('login_view')


@login_required
def welcome_view(request):
    posts = Post.objects.all().order_by('-created_at')
    post_form = PostForm(request.POST or None, request.FILES or None)

    if request.method == 'POST' and post_form.is_valid():
        new_post = post_form.save(commit=False)
        new_post.user = request.user
        new_post.save()
        messages.success(request, "Post uploaded successfully")
        return redirect('welcome_view')

    return render(request, 'welcome.html', {
        'user': request.user,
        'posts': posts,
        'post_form': post_form,
        'title': 'Welcome'
    })

@login_required
def add_comment(request, post_id):
    post = Post.objects.get(id=post_id)
    comment_form = CommentForm(request.POST)

    if comment_form.is_valid():
        comment = comment_form.save(commit=False)
        comment.user = request.user
        comment.post = post
        comment.save()
        messages.success(request, "Comment added")
    return redirect('welcome_view')

