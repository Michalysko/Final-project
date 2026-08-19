from django.db import migrations, models


NAME_TRANSLATIONS = {
    'Life insurance': 'Životní pojištění',
    'Accident insurance': 'Úrazové pojištění',
    'Property insurance': 'Majetkové pojištění',
    'Travel insurance': 'Cestovní pojištění',
    'Vehicle insurance': 'Pojištění vozidla',
    'Health insurance': 'Zdravotní pojištění',
    'Liability insurance': 'Pojištění odpovědnosti',
    'Home insurance': 'Pojištění domu',
    'Household insurance': 'Pojištění domácnosti',
    'Business insurance': 'Podnikatelské pojištění',
    'Pet insurance': 'Pojištění mazlíčků',
    'Legal protection insurance': 'Pojištění právní ochrany',
    'Loan insurance': 'Pojištění úvěru',
    'Pension insurance': 'Penzijní pojištění',
}

SUBJECT_TRANSLATIONS = {
    'Life': 'Život',
    'Accident': 'Úraz',
    'Property': 'Majetek',
    'Travel': 'Cestování',
    'Vehicle': 'Vozidlo',
    'Health': 'Zdraví',
    'Liability': 'Odpovědnost',
    'Home': 'Dům',
    'Household': 'Domácnost',
    'Business': 'Podnikání',
    'Pet': 'Mazlíček',
    'Legal protection': 'Právní ochrana',
    'Loan': 'Úvěr',
    'Pension': 'Penzijní spoření',
}


def copy_insurance_type_translations(apps, schema_editor):
    InsuranceType = apps.get_model('insured', 'InsuranceType')

    for insurance_type in InsuranceType.objects.all():
        insurance_type.name_en = insurance_type.name
        insurance_type.name_cs = NAME_TRANSLATIONS.get(
            insurance_type.name,
            insurance_type.name,
        )
        insurance_type.subject_en = insurance_type.subject
        insurance_type.subject_cs = SUBJECT_TRANSLATIONS.get(
            insurance_type.subject,
            insurance_type.subject,
        )
        insurance_type.save(
            update_fields=[
                'name_en',
                'name_cs',
                'subject_en',
                'subject_cs',
            ]
        )


class Migration(migrations.Migration):

    dependencies = [
        ('insured', '0004_insuredperson_user'),
    ]

    operations = [
        migrations.AddField(
            model_name='insurancetype',
            name='name_en',
            field=models.CharField(blank=True, default='', max_length=100),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='insurancetype',
            name='name_cs',
            field=models.CharField(blank=True, default='', max_length=100),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='insurancetype',
            name='subject_en',
            field=models.CharField(blank=True, default='', max_length=255),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='insurancetype',
            name='subject_cs',
            field=models.CharField(blank=True, default='', max_length=255),
            preserve_default=False,
        ),
        migrations.RunPython(
            copy_insurance_type_translations,
            migrations.RunPython.noop,
        ),
        migrations.AlterField(
            model_name='insurancetype',
            name='name_en',
            field=models.CharField(max_length=100),
        ),
        migrations.AlterField(
            model_name='insurancetype',
            name='name_cs',
            field=models.CharField(max_length=100),
        ),
        migrations.AlterField(
            model_name='insurancetype',
            name='subject_en',
            field=models.CharField(max_length=255),
        ),
        migrations.AlterField(
            model_name='insurancetype',
            name='subject_cs',
            field=models.CharField(max_length=255),
        ),
        migrations.RemoveField(
            model_name='insurancetype',
            name='name',
        ),
        migrations.RemoveField(
            model_name='insurancetype',
            name='subject',
        ),
    ]
