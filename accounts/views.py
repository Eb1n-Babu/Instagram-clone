from django.contrib import messages
from django.contrib.auth import login , logout
from django.shortcuts import redirect, render
from accounts.forms import RegistrationForm, LoginForm


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
    # 🧹 Flush any leftover messages from previous session
    storage = messages.get_messages(request)
    list(storage)  # Consumes and clears the queue

    form = LoginForm(request, data=request.POST or None)  # ✅ pass request for AuthenticationForm

    if request.method == "POST":
        if form.is_valid():
            user = form.get_user()
            login(request, user)
            messages.success(request, "Login successful")
            return render(request, 'welcome.html', {'user': user})  # 👋 render welcome page
        else:
            messages.error(request, "Invalid username or password")

    return render(request, 'login.html', {'form': form, 'title': 'Login'})


def logout_view(request):
    logout(request)
    storage = messages.get_messages(request)
    list(storage)  # Clear any old messages
    messages.success(request, "Logout successful")
    return redirect('login_view')


