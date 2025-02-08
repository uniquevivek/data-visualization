from django.conf import settings
from django.conf.urls.static import static
from django.urls import path
from visual import views
from django.contrib.auth import views as auth_views

urlpatterns = [
    path('', views.index, name='home'),
    path('unknown/', views.unknown, name='uknown'),
    path('polar/', views.polar, name='polar'),
    path('area/', views.area, name='area'),
    path('input-file/', views.inputFile, name='inputfile'),
    path('delete_all/', views.delete_all_insights, name='delete_all_insights'),
    path('api/insights/', views.insight_list, name='insight-list'),
    path('api/insights/<int:pk>/', views.insight_detail, name='insight-detail'),
    path('saved-items/',views.filter, name='saved-items'),
    path('login/', auth_views.LoginView.as_view(template_name='login.html'), name='login'),
    path('logout/', auth_views.LogoutView.as_view(), name='logout'),
]

urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)