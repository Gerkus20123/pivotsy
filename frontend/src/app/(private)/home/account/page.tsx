'use client'
import FieldForm from '@/components/fieldform';
import JobCard from '@/components/job-card';
import Pagination from '@/components/pagination';
import CustomScroll from '@/components/scrollbar';
import { Button } from '@/components/ui/button';
import { fetchAllUserCreatedJobOffers, fetchingCurrentUserData } from '@/lib/api/fetching';
import { editUserData } from '@/lib/api/postRequests';
import { FieldConfig } from '@/lib/interfaces/fields';
import { Job } from '@/lib/interfaces/job';
import { User } from '@/lib/interfaces/user';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useMemo, useState } from 'react'
import { useForm } from 'react-hook-form';
import z from 'zod';

function Account() {

  const messages = [
    {"id": 1, "title": "Python Development Job Offer", "content": "Hello, I am interested in the job. I send my CV.", "author": "Gerkus20123", "created_at": "26.04.2026"},
    {"id": 2, "title": "Technition", "content": "Hello, I am interested in the job. I send my CV.", "author": "Andre432", "created_at": "23.04.2026"},
    {"id": 3, "title": "Interested in Job, sending CV", "content": "Hello, I am interested in the job. I send my CV.", "author": "VasiaPupkin", "created_at": "13.04.2026"},
  ];

  const [userData, setUserData] = useState<User>();
  const [isEdit, setIsEdit] = useState(false);
  const [userCreatedJobs, setUserCreatedJobs] = useState<Job[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const formSchema = z.object({
      name: z.string().min(2, "Name is required"),
      phone_number: z.string().min(9, "Write the correct phonenumber"),
      company_name: z.string().optional()
  })

  type FormValues = z.infer<typeof formSchema> & Partial<User>;

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { 
      name: "",
      phone_number: "",
      company_name: ""
    },
  });

  const { reset } = form;

  const editUserConfig: FieldConfig<FormValues>[] = useMemo(() => [
    { name: 'name', label: 'Name', type: 'text' },
    { name: 'phone_number', label: 'Phone Number', type: 'text' },
    { name: 'company_name', label: 'Company', type: 'text' }
  ], []);

  // Loading the account info
  const loadUser = async () => {
    const data = await fetchingCurrentUserData()
    setUserData(data)
  };

  // Loading the user created job offers
  const loadUserJobOffers = async (page: number) => {
    const data = await fetchAllUserCreatedJobOffers(page);
    setUserCreatedJobs(data.items)
    setTotalPages(data.pages);
  }

  useEffect(() => {
    if (userData) {
      reset({
        name: userData.name || "",
        phone_number: userData.phone_number || "",
        company_name: userData.company_name || ""
      });
    }
  }, [userData, reset]);

  useEffect(() => {
    loadUser();
  }, []);

  useEffect(() => {
    loadUserJobOffers(currentPage)
  }, [currentPage])

  const editBasicInformation = async (data: FormValues) => {
    try {
      const payload = {
        name: data.name,
        phone_number: data.phone_number,
        company_name: data.company_name || "",
        email: userData?.email
      };

      await editUserData(payload);
      await loadUser()
      setIsEdit(false);
    } catch (error) {
      console.error("Błąd edycji:", error);
    }
  };

  return (
    <div className='min-h-screen'>
            {/* Page Title */}
            <h1 className="text-3xl font-bold mb-8">Account</h1>

            <hr></hr>

            {/* Basic Info &  */}
            <div className='grid lg:grid-cols-2 grid-cols-1 gap-4'>

              {/* Basic Information */}
              <div className="mt-8 p-4 border border-slate-300 rounded-xl flex flex-col gap-2" >
              
                <h2 className='text-xl font-bold text-gray-700 mb-4'> Basic Information</h2>
                
                <div key={isEdit ? 'edit-mode' : 'view-mode'}>
                  {isEdit ? (
                      <FieldForm
                        fieldsConfig={editUserConfig as any}
                        form={form} 
                        formId="edit-user-form" 
                        onSubmit={editBasicInformation}
                      />
                  ) : (
                    <div>
                      <p className='font-bold'> Name </p>
                      <p className='mx-2 my-4'> {userData?.name} </p>

                      <p className='font-bold'> Phone Number </p>
                      <p className='mx-2 my-4'> {userData?.phone_number} </p>

                      <p className='font-bold'> Company</p>
                      <p className='mx-2 my-4'> {userData?.company_name} </p>
                    </div>
                  )}
                </div>
                
                <div className="flex gap-2 mt-4">
                  {isEdit ? (
                    <div className='flex w-full justify-center items-center gap-4'>
                      <Button 
                        variant="outline" 
                        className="w-1/2"
                        onClick={() => {
                          setIsEdit(false);
                          reset();
                        }}
                      >
                        Cancel
                      </Button>
                      <Button 
                        type="submit"
                        form="edit-user-form"
                        className="w-1/2"
                        disabled={form.formState.isSubmitting}
                      >
                        Apply
                      </Button>
                    </div>
                  ) : (
                  <Button
                    type="button"
                    form={undefined}
                    className="w-full"
                    onClick={() => {
                      if (!isEdit) setIsEdit(true);
                    }}
                    disabled={form.formState.isSubmitting}
                  >
                   Edit
                  </Button>
                  )}
                  
                </div>
              </div>

              {/* Messages (simplified version) */}
              <div className="mt-8 p-4 border border-slate-300 rounded-xl flex flex-col gap-2" >
                
                <h2 className='text-xl font-bold text-gray-700'> Messages </h2>

                <div className='flex gap-2'>
                  <CustomScroll
                    className='w-full rounded-xl max-h-[245px]'
                    childrenType='mr-10'
                  >
                      {/* Messsage Cards */}
                      {messages.map((msg) => (
                        <div 
                          key={msg.id}
                          className='bg-slate-100 my-4 p-2 rounded-xl cursor-pointer'
                        >
                          <p className='font-bold text-[10px] mb-2'>{msg.title}</p>
                          <p className='text-[10px] mb-2 truncate'>{msg.content}</p>
                          <div className='flex justify-between items-center'>
                            <p className='text-[10px]'>{msg.author}</p>
                            <p className='text-[10px]'>{msg.created_at}</p>
                          </div>
                        </div>
                      ))}
                  </CustomScroll>
                </div>
                
                <Button>
                    Show More
                </Button>
                
              </div>
            </div>
            
            {/* Your Created Job Offers */}
            <div className="mt-8 p-4 border border-slate-300 rounded-xl flex flex-col gap-2" >
              
              <h2 className='text-xl font-bold text-gray-700'> Your Created Job Offers </h2>

              <JobCard 
                jobs={userCreatedJobs}
              />
              
              <Pagination 
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={(newPage: number) => setCurrentPage(newPage)}
              />
            </div>
    </div>
  )
}

export default Account;