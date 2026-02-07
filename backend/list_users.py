import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'learnhub.settings')
django.setup()

from apps.accounts.models import User

users = User.objects.all()

print('\n' + '='*80)
print('REGISTERED USERS')
print('='*80)
print(f"\n{'Email':<30} {'Password':<15} {'Role':<10} {'Name':<20} {'Admin'}")
print('-'*80)

# Display users with their test passwords
test_passwords = {
    'admin@learnhub.com': 'admin123',
    'student@learnhub.com': 'student123',
    'checker@learnhub.com': 'checker123'
}

for user in users:
    password = test_passwords.get(user.email, '(unknown)')
    is_admin = 'Yes' if user.is_superuser else 'No'
    full_name = f'{user.first_name} {user.last_name}'
    print(f'{user.email:<30} {password:<15} {user.role:<10} {full_name:<20} {is_admin}')

print(f'\nTotal Users: {users.count()}')
print('='*80 + '\n')
