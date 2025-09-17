-- Create application messages table for chat system
CREATE TABLE IF NOT EXISTS public.application_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  application_id UUID NOT NULL,
  content TEXT NOT NULL,
  sender_id UUID NOT NULL,
  sender_role TEXT NOT NULL,
  sender_name TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.application_messages ENABLE ROW LEVEL SECURITY;

-- Create policies for chat messages
CREATE POLICY "Users can view messages for their applications" 
ON public.application_messages 
FOR SELECT 
USING (
  sender_id = auth.uid() OR 
  application_id IN (
    SELECT id FROM applications WHERE student_uid = auth.uid()
  ) OR
  application_id IN (
    SELECT a.id FROM applications a
    JOIN jobs j ON a.job_id = j.id
    JOIN companies c ON j.company_id = c.id
    WHERE c.hr_owner_uid = auth.uid()
  )
);

CREATE POLICY "Users can send messages for their applications" 
ON public.application_messages 
FOR INSERT 
WITH CHECK (
  sender_id = auth.uid() AND (
    application_id IN (
      SELECT id FROM applications WHERE student_uid = auth.uid()
    ) OR
    application_id IN (
      SELECT a.id FROM applications a
      JOIN jobs j ON a.job_id = j.id
      JOIN companies c ON j.company_id = c.id
      WHERE c.hr_owner_uid = auth.uid()
    )
  )
);

-- Create AI usage logs table
CREATE TABLE IF NOT EXISTS public.ai_usage_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  request_type TEXT NOT NULL,
  response_length INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS for AI logs
ALTER TABLE public.ai_usage_logs ENABLE ROW LEVEL SECURITY;

-- Create policy for AI logs
CREATE POLICY "Users can view their own AI usage logs" 
ON public.ai_usage_logs 
FOR SELECT 
USING (user_id = auth.uid());

CREATE POLICY "System can insert AI usage logs" 
ON public.ai_usage_logs 
FOR INSERT 
WITH CHECK (true);