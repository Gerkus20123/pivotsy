'use client'

import { Button } from '@/components/ui/button';
import JobOfferSkeleton from '@/components/ui/skeletons/jobOfferSkeleton';
import { use, useEffect, useMemo, useState } from 'react'
import { Job } from '@/lib/interfaces/job';
import { fetchJob } from '@/lib/api/fetching';
import { JobCategoryOptions } from '../../../../../../constants/job_category_options';
import * as z from "zod"
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { FieldConfig } from '@/lib/interfaces/fields';
import { AgreementTypeOptions } from '../../../../../../constants/agreement_type_options';
import { ScheduleOptions } from '../../../../../../constants/schedule_options';
import { WorkExperienceOptions } from '../../../../../../constants/work_experience_options';
import { TransportAvailabilityOptions } from '../../../../../../constants/trasport_availability_options';
import { AdditionalRequirements } from '../../../../../../constants/additional_requirements';
import { TypeOfWorkOptions } from '../../../../../../constants/type_of_work_options';
import { CurrencyOptionsData } from '../../../../../../constants/currency_options';
import FieldForm from '@/components/fieldform';
import { cn } from '@/lib/utils';
import { editUserJob } from '@/lib/api/postRequests';
import { toast } from 'sonner';

interface PageProps {
    params: Promise<{ 
        job_id: string,
    }>; 
    searchParams: Promise<{ 
        editingMode?: string 
    }>;
}

function EditJobOffer({ 
    params
} : PageProps
) {

    const [job, setJob] = useState<Job | null>(null);
    const [loading, setLoading] = useState(true);
    const resolvedParams = use(params);
    const job_id = Number(resolvedParams.job_id);
    const [userData, setUserData] = useState<any>(null);
    const [errorMessage, setErrorMessage] = useState("");

    const formSchema = z.object({
        short_description: z.string().min(1, "Title is required"),
        long_description: z.string().min(10, "Description is too short"),
        background_image: z.any().optional(),
        logo: z.any().optional(),
        agreement_type: z.array(z.string()).min(1, "Choose at least one work agreement"),
        experience_requirement: z.string().min(1, "Choose the work experience criteria"),
        transport_availability: z.array(z.string()).min(1, "Choose at least one transport availability option"),
        schedule: z.array(z.string()).min(1, "Choose at least one work schedule"),
        type_of_work: z.array(z.string()),
        category: z.string(),
        location: z.string(),
        subcategory: z.string().optional(),
        payment: z.number().int().positive(),  
        currency: z.string(),
        additional_requirements: z.array(z.string()),
        author_info: z.object({
          name: z.string().min(2, "Name is required"),
          phone_number: z.string().min(9, "Write the correct phonenumber"),
          company_name: z.string().optional()
        })
    })

    type FormValues = z.infer<typeof formSchema>

    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: { 
          short_description: "", 
          long_description: "",
          background_image: "",
          logo: "", 
          agreement_type: [],
          experience_requirement: "",
          transport_availability: [],
          schedule: [],
          type_of_work: [],
          location: "",
          category: "",
          subcategory: "",
          payment: 1,
          currency: "",
          additional_requirements: [],
          author_info: {
            name: userData?.name || "",
            phone_number: userData?.phone_number || "",
            company_name: userData?.company_name || ""
          }
        },
    });

    const { reset } = form;

    useEffect(() => {

        const parseToArray = (value: any) => {
            if (Array.isArray(value)) return value;
            if (typeof value === 'string' && value.trim() !== "") {
                return value.split(',').map(item => item.trim());
            }
            return [];
        };

        if (job) {
            const defaultValues: FormValues = {
                short_description: job.short_description || "",
                long_description: job.long_description || "",
                background_image: job.background_image || "",
                logo: job.logo || "",
                agreement_type: parseToArray(job.agreement_type),
                experience_requirement: typeof job.experience_requirement === 'string' ? job.experience_requirement : "",
                transport_availability: parseToArray(job.transport_availability),
                schedule: parseToArray(job.schedule),
                type_of_work: parseToArray(job.type_of_work),
                category: job.category || "",
                location: job.location || "",
                subcategory: job.subcategory || "",
                payment: Number(job.payment) || 1,
                currency: job.currency || "",
                additional_requirements: parseToArray(job.additional_requirements),
                author_info: {
                    name: job.user?.name || "",
                    phone_number: job.user?.phone_number || "",
                    company_name: job.user?.company_name || ""
                }
            };
            reset(defaultValues);
        }
    }, [job, reset]);

    const allFieldsConfig: FieldConfig<FormValues>[] = useMemo(() => [
        { name: 'category', label: 'Category', type: 'category_selector', categories: JobCategoryOptions},
        { name: 'location', label: 'Job Location', type: 'text'},
        { name: 'payment', label: 'Payment', type: 'number'},    
        { name: 'currency', label: 'Currency', type: 'currency_selector', currency: CurrencyOptionsData},
        { name: 'author_info', label: 'Author Data', type: 'author'},
        { name: 'short_description', label: 'Job Title', type: 'text', placeholder: 'Job Title...'},
        { name: 'long_description', label: 'Description', type: 'textarea', placeholder: 'Description...'},
        { name: 'background_image', label: 'Background Image', type: 'image_uploader'},
        { name: 'logo', label: 'Job/Firm Logo', type: 'image_uploader'},
        { name: 'agreement_type', label: 'Agreement type', type: 'checkbox', options: AgreementTypeOptions},
        { name: 'schedule', label: 'Schedule', type: 'checkbox', options: ScheduleOptions},
        { name: 'experience_requirement', label: 'Experience Requirement', type: 'checkbox', options: WorkExperienceOptions},
        { name: 'transport_availability', label: 'Transport Availability', type: 'checkbox', options: TransportAvailabilityOptions},
        { name: 'additional_requirements', label: 'Additional Requirements', type: 'checkbox', options: AdditionalRequirements},
        { name: 'type_of_work', label: 'Type Of Work', type: 'checkbox', options: TypeOfWorkOptions},
      ], []);

    const getFields = (names: (keyof FormValues | string)[]) => 
        allFieldsConfig.filter(field => names.includes(field.name));

    const loadData = async () => {
        try {
            setLoading(true);
            
            const [gotJob] = await Promise.all([
                fetchJob(job_id),
            ]);

            setJob(gotJob);
        } catch (error) {
            console.error("An error has occured while loading the job:", error);
        } finally {
            setLoading(false);
        }
    };

    const onSubmit = async (data: FormValues) => {

        const formData = new FormData();

        const complexFields = [
            'logo', 'background_image', 'author_info', 
            'agreement_type', 'schedule', 'transport_availability', 
            'type_of_work', 'additional_requirements'
        ];
    
        Object.keys(data).forEach(key => {
            if (!complexFields.includes(key)) {
                formData.append(key, (data as any)[key]);
            }
        });
    
        // 2. Obsługa plików
        if (data.logo instanceof File) formData.append('logo', data.logo);
        if (data.background_image instanceof File) formData.append('background_image', data.background_image);
    
        // 3. Obsługa pól złożonych (Twoja logika z Create Job)
        formData.append('author_info', JSON.stringify(data.author_info));
        formData.append('agreement_type', data.agreement_type.join(", "));
        formData.append('schedule', data.schedule.join(", "));
        formData.append('transport_availability', data.transport_availability.join(", "));
        formData.append('type_of_work', data.type_of_work.join(", "));
        formData.append('additional_requirements', data.additional_requirements.join(", "));

        try {
            setLoading(true);
            await editUserJob(job_id, formData);
            toast.success("Job has been successfully updated.")
        } catch (error: any) {
            console.error(error);
            const msg = error.response?.data?.message || "An unexpected error occurred while updating the job.";
            setErrorMessage(msg);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (job_id) {
            loadData();
        }
    }, [job_id])

    if (loading) return <JobOfferSkeleton />;
    if (!job) return <p>Offer not found.</p>;
    
    return (
        <div className='min-h-screen'>

            {/* Page Title */}
            <h1 className="text-3xl font-bold mb-8">Edit Job Offer</h1>

            <hr></hr>

            <div>
              <div className='text-xl mt-10'>
                  <h2>The more the details, the better</h2>
              </div>
              
              {/* Job Title and Description */}
              <div className='mt-10'>
                <FieldForm 
                  form={form} 
                  formId="edit-job-form" 
                  fieldsConfig={getFields(['short_description', 'long_description'])}
                  onSubmit={onSubmit}
                />         
              </div>

              <div className='mt-5'>
                <FieldForm 
                  form={form} 
                  formId="edit-job-form" 
                  fieldsConfig={getFields(['background_image'])}
                  onSubmit={onSubmit}
                />
              </div>

              <div className='mt-5'>
                <FieldForm 
                  form={form} 
                  formId="edit-job-form" 
                  fieldsConfig={getFields(['logo'])}
                  onSubmit={onSubmit}
                />
              </div>

              {/* Fields with checkboxes: Agreement Type, Schedule, Experience Requirements, Transport 
              Availability, Additional Requirements, Type of Work */}
              <div className='mt-5 grid lg:grid-cols-6 grid-cols-1 gap-5'>
                
                {/* Agreement Type */}
                <FieldForm 
                  form={form} 
                  formId="edit-job-form" 
                  fieldsConfig={getFields(['agreement_type'])}
                  onSubmit={onSubmit}
                />

                {/* Schedule */}
                <FieldForm 
                  form={form} 
                  formId="edit-job-form" 
                  fieldsConfig={getFields(['schedule'])}
                  onSubmit={onSubmit}
                />

                {/* Experience Requirements */}
                <FieldForm 
                  form={form} 
                  formId="edit-job-form" 
                  fieldsConfig={getFields(['experience_requirement'])}
                  onSubmit={onSubmit}
                />
                
                {/* Transport Availability */}
                <FieldForm 
                  form={form} 
                  formId="edit-job-form" 
                  fieldsConfig={getFields(['transport_availability'])}
                  onSubmit={onSubmit}
                />

                {/* Additional Requirements */}
                <FieldForm 
                  form={form} 
                  formId="edit-job-form" 
                  fieldsConfig={getFields(['additional_requirements'])}
                  onSubmit={onSubmit}
                />

                {/* Type of Work */}
                <FieldForm 
                  form={form} 
                  formId="edit-job-form" 
                  fieldsConfig={getFields(['type_of_work'])}
                  onSubmit={onSubmit}
                />
              </div>
              
              {/* Fields: Category, Location, Payment, Currency, Author Info */}
              <div className='mt-5'>
                <FieldForm 
                  form={form} 
                  formId="edit-job-form" 
                  fieldsConfig={getFields(['category', 'location', 'payment', 'currency', 'author_info'])}
                  onSubmit={onSubmit}
                />
              </div>
              
                {/* Form Errors */}
                <div className="relative w-full h-[180px] mt-10"> 
                  <div className={cn(
                    "absolute inset-0 transition-all duration-300 transform",
                    Object.keys(form.formState.errors).length > 0 
                      ? "opacity-100 scale-100 translate-y-0" 
                      : "opacity-0 scale-95 -translate-y-2 pointer-events-none"
                  )}>
                    <div className="bg-red-50 p-3 rounded-xl border border-red-100 shadow-sm">
                      <p className="text-red-600 font-bold text-[10px] uppercase tracking-wider mb-1">
                        Validation Errors
                      </p>
                      <ul className="space-y-1">
                        {Object.values(form.formState.errors).map((error, index) => (
                          <li key={index} className="text-red-500 text-xs flex items-center gap-1">
                            <span className="w-1 h-1 bg-red-400 rounded-full shrink-0" />
                            {error?.message?.toString()}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>

              <Button 
                type="submit" 
                form="edit-job-form"
                variant="default"
                className="mt-5 w-full"
                disabled={loading}
                onClick={() => {
                  const errors = form.formState.errors;
                  if (Object.keys(errors).length > 0) {
                    console.log("The forms contain errors:", errors);
                  }
                }}
              >
                {loading ? "Editing..." : "Edit"}
              </Button>

              {errorMessage && (
                <div className="bg-destructive/15 text-destructive p-3 rounded-lg mb-5 text-sm">
                  {errorMessage}
                </div>
              )}

            </div>
    </div> 
    )
}

export default EditJobOffer;