from django.db import migrations, models


def copy_subject_to_contracts(apps, schema_editor):
    InsuranceContract = apps.get_model('insured', 'InsuranceContract')

    for contract in InsuranceContract.objects.select_related('insurance_type'):
        contract.subject = contract.insurance_type.subject_en
        contract.save(update_fields=['subject'])


class Migration(migrations.Migration):

    dependencies = [
        ('insured', '0005_insurancetype_i18n'),
    ]

    operations = [
        migrations.AddField(
            model_name='insurancecontract',
            name='subject',
            field=models.CharField(blank=True, default='', max_length=255),
            preserve_default=False,
        ),
        migrations.RunPython(
            copy_subject_to_contracts,
            migrations.RunPython.noop,
        ),
        migrations.AlterField(
            model_name='insurancecontract',
            name='subject',
            field=models.CharField(max_length=255),
        ),
        migrations.RemoveField(
            model_name='insurancetype',
            name='subject_cs',
        ),
        migrations.RemoveField(
            model_name='insurancetype',
            name='subject_en',
        ),
    ]
