import os
from datetime import timedelta

import django
from django.utils import timezone

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'learnhub.settings')
django.setup()

from apps.analytics.models import AnalyticsDaily
from apps.audit.models import FeatureFlag, SystemSetting
from apps.countries.models import Country
from apps.qs.models import QSRanking
from apps.universities.models import Program, University


def seed_countries():
    countries = [
        {'name': 'United States', 'iso_code': 'USA', 'region': 'North America', 'timezone': 'UTC-5', 'currency': 'USD'},
        {'name': 'United Kingdom', 'iso_code': 'GBR', 'region': 'Europe', 'timezone': 'UTC+0', 'currency': 'GBP'},
        {'name': 'Canada', 'iso_code': 'CAN', 'region': 'North America', 'timezone': 'UTC-5', 'currency': 'CAD'},
        {'name': 'Australia', 'iso_code': 'AUS', 'region': 'Oceania', 'timezone': 'UTC+10', 'currency': 'AUD'},
        {'name': 'Germany', 'iso_code': 'DEU', 'region': 'Europe', 'timezone': 'UTC+1', 'currency': 'EUR'},
    ]

    results = {}
    for data in countries:
        obj, _ = Country.objects.get_or_create(iso_code=data['iso_code'], defaults=data)
        results[data['iso_code']] = obj
    return results


def seed_universities(countries):
    universities = [
        {'name': 'Harbor State University', 'country': countries['USA'], 'qs_university_id': 'USA-001'},
        {'name': 'Northbridge Institute of Technology', 'country': countries['GBR'], 'qs_university_id': 'GBR-014'},
        {'name': 'Maple Ridge University', 'country': countries['CAN'], 'qs_university_id': 'CAN-021'},
        {'name': 'Coastal Pacific University', 'country': countries['AUS'], 'qs_university_id': 'AUS-037'},
        {'name': 'Rheinland Technical University', 'country': countries['DEU'], 'qs_university_id': 'DEU-052'},
    ]

    results = []
    for data in universities:
        obj, _ = University.objects.get_or_create(
            name=data['name'],
            defaults={
                'country': data['country'],
                'qs_university_id': data['qs_university_id'],
                'website_url': 'https://example.edu',
                'is_active': True,
            },
        )
        results.append(obj)
    return results


def seed_programs(universities):
    programs = [
        ('Computer Science', 'BACHELOR', 'Fall 2026', 48, 18000),
        ('Data Science', 'MASTER', 'Fall 2026', 24, 24000),
        ('Business Administration', 'MASTER', 'Spring 2027', 24, 22000),
        ('Mechanical Engineering', 'BACHELOR', 'Fall 2026', 48, 20000),
        ('Biomedical Sciences', 'PHD', 'Fall 2026', 60, 0),
    ]

    for university in universities:
        for name, level, intake, duration, fee in programs:
            Program.objects.get_or_create(
                university=university,
                name=f"{name} - {university.name}",
                defaults={
                    'level': level,
                    'intake_period': intake,
                    'duration_months': duration,
                    'tuition_fee': fee,
                    'is_active': True,
                },
            )


def seed_qs_rankings(universities):
    snapshot_date = timezone.now().date()
    rank_year = 2026
    for index, university in enumerate(universities, start=1):
        QSRanking.objects.get_or_create(
            qs_university_id=university.qs_university_id,
            rank_year=rank_year,
            snapshot_date=snapshot_date,
            defaults={
                'university_name': university.name,
                'rank_global': index * 25,
                'score_overall': 70 + index,
                'country': university.country,
            },
        )


def seed_analytics():
    today = timezone.now().date()
    for offset in range(7):
        date = today - timedelta(days=offset)
        AnalyticsDaily.objects.get_or_create(
            date=date,
            defaults={
                'total_applications': 120 + offset * 5,
                'new_applicants': 30 + offset * 2,
                'reviews_completed': 22 + offset,
                'documents_verified': 45 + offset * 2,
                'avg_review_time_minutes': 95 - offset * 2,
            },
        )


def seed_feature_flags():
    flags = [
        ('study_hub', 'Study Hub', 'Enable Study Hub content', True),
        ('qs_rankings', 'QS Rankings', 'Enable QS rankings module', True),
        ('messaging', 'Messaging', 'Enable user messaging', True),
        ('advanced_analytics', 'Advanced Analytics', 'Enable extended analytics panels', False),
    ]

    for key, name, description, enabled in flags:
        FeatureFlag.objects.get_or_create(
            key=key,
            defaults={'name': name, 'description': description, 'is_enabled': enabled},
        )


def seed_system_settings():
    settings = [
        ('support_email', 'support@learnhub.com'),
        ('default_application_year', '2026-2027'),
        ('default_intake', 'Fall 2026'),
        ('maintenance_mode', 'false'),
    ]

    for key, value in settings:
        SystemSetting.objects.get_or_create(key=key, defaults={'value': value})


def main():
    countries = seed_countries()
    universities = seed_universities(countries)
    seed_programs(universities)
    seed_qs_rankings(universities)
    seed_analytics()
    seed_feature_flags()
    seed_system_settings()
    print('Demo data seeded successfully.')


if __name__ == '__main__':
    main()
