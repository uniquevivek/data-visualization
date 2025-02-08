from django.shortcuts import render, HttpResponse, redirect
import json
from django.utils.dateparse import parse_datetime
from django.contrib import messages
from .models import Insight
from .forms import JSONUploadForm
from django.contrib.auth.decorators import login_required

# Create your views here.
@login_required
def index(request):
    return render(request, 'index.html')

def unknown(request):
    return render(request, 'unknown.html')

@login_required
def polar(request):
    return render(request, 'polar.html')

@login_required
def area(request):
    return render(request, 'area.html')

@login_required
def inputFile(request): 
    if request.method == "POST":
        form = JSONUploadForm(request.POST, request.FILES)
        if form.is_valid():
            file = request.FILES["json_file"]  # Get single file
            print("File received:", file.name)

            try:
                data = json.load(file.open())  # Open and decode JSON
                for entry in data:
                    Insight.objects.create(
                        end_year=entry.get("end_year", ""),
                        intensity=entry.get("intensity", 0),
                        sector=entry.get("sector", ""),
                        topic=entry.get("topic", ""),
                        insight=entry.get("insight", ""),
                        url=entry.get("url", ""),
                        region=entry.get("region", ""),
                        start_year=entry.get("start_year", ""),
                        impact=entry.get("impact", ""),
                        added=parse_datetime(entry.get("added", "")) or None,
                        published=parse_datetime(entry.get("published", "")) or None,
                        country=entry.get("country", ""),
                        relevance=entry.get("relevance", 0),
                        pestle=entry.get("pestle", ""),
                        source=entry.get("source", ""),
                        title=entry.get("title", ""),
                        likelihood=entry.get("likelihood", 0)
                    )
                messages.success(request, f"Successfully uploaded {file.name}")
            except Exception as e:
                messages.error(request, f"Error uploading {file.name}: {e}")

            return redirect("inputfile")
    else:
        form = JSONUploadForm()

    return render(request, 'inputFile.html', {"form": form})


@login_required
def delete_all_insights(request):
    Insight.objects.all().delete()  # Deletes all records in the table
    messages.success(request, "All data has been successfully deleted.")
    return redirect("inputfile")  # Redirect to your desired page


from django.http import JsonResponse
from .models import Insight

# Fetch all insights
@login_required
def insight_list(request):
    insights = Insight.objects.all().values()  # Convert QuerySet to list of dictionaries
    return JsonResponse(list(insights), safe=False)

# Fetch a single insight by ID
@login_required
def insight_detail(request, pk):
    try:
        insight = Insight.objects.filter(id=pk).values().first()
        if insight:
            return JsonResponse(insight, safe=False)
        return JsonResponse({"error": "Insight not found"}, status=404)
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)

from django.db.models import Q
from django.core.paginator import Paginator

@login_required
def filter(request):

    data = Insight.objects.all()
    end_year = request.GET.get('end_year')
    topic = request.GET.get('topic')
    sector = request.GET.get('sector')
    region = request.GET.get('region')
    pestle = request.GET.get('pestle')
    source = request.GET.get('source')
    swot = request.GET.get('swot')
    country = request.GET.get('country')
    city = request.GET.get('city')

    # Apply filters if provided
    if end_year:
        data = data.filter(end_year=end_year)
    if topic:
        data = data.filter(topic__icontains=topic)
    if sector:
        data = data.filter(sector__icontains=sector)
    if region:
        data = data.filter(region__icontains=region)
    if pestle:
        data = data.filter(pestle__icontains=pestle)
    if source:
        data = data.filter(source__icontains=source)
    if country:
        data = data.filter(country__icontains=country)

    paginator = Paginator(data, 10)
    page_number = request.GET.get('page')
    page_data = paginator.get_page(page_number)
    
    
    context = {
        'data': page_data
    }
    return render(request, 'filterpage.html', context)