export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          email: string;
          created_at: string;
        };
        Insert: {
          email: string;
          password?: string;
        };
        Update: {
          email?: string;
        };
      };
      profiles: {
        Row: {
          id: string;
          email: string;
          full_name: string;
          company: string | null;
          created_at: string;
        };
        Insert: {
          id: string;
          email: string;
          full_name: string;
          company?: string | null;
        };
        Update: {
          full_name?: string;
          company?: string | null;
        };
      };
      analysis_jobs: {
        Row: {
          id: string;
          user_id: string;
          filename: string;
          segments: any;
          created_at: string;
        };
        Insert: {
          user_id: string;
          filename: string;
          segments?: any;
        };
      };
      leads: {
        Row: {
          id: string;
          email: string;
          source: string;
          converted: boolean;
          created_at: string;
        };
        Insert: {
          email: string;
          source: string;
          converted?: boolean;
        };
      };
    };
    Views: {};
    Functions: {};
  };
};