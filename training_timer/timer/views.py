from django.shortcuts import render


def top(request):
    return render(request, 'timer/top.html')

def test(request):
    return render(request, 'timer/test.html')
