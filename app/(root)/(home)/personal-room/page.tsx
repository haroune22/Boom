"use client";

import { useUser } from "@clerk/nextjs";
import { useStreamVideoClient } from "@stream-io/video-react-sdk";
import { useRouter } from "next/navigation";

import { useGetCallById } from "@/hooks/useGetCallById";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Copy, Edit, LucideIcon, LucideProps, Plus, Trash } from "lucide-react";
import { Separator } from "@/components/ui/separator";




const Table = ({
  title,
  description,
  Icon
}: {
  title: string;
  description: string;
  Icon?: LucideIcon
}) => {
  const { user } = useUser();

  const { toast } = useToast();

  const meetingId = user?.id
  const meetingLink = `${process.env.NEXT_PUBLIC_BASE_URL}/meetings/${meetingId}?personal=true`;

  return (
    <div className="flex flex-col items-start gap-2 xl:flex-row">
      <h1 className="text-base font-medium text-sky-1 lg:text-xl xl:min-w-32">
        {title}:
      </h1>
      <h1 className="truncate text-sm font-bold max-sm:max-w-[320px] lg:text-xl">
        {description}
      </h1>
      {Icon ? 
        <Icon 
          className="cursor-pointer w-5 h-5 ml-2" 
          onClick={() => {
            navigator.clipboard.writeText(meetingLink);
            toast({
              title: "Link Copied",
            });
          }}
        /> : 
        null
      }
    </div>
  );
};



const PersonalRoom = () => {

  const router = useRouter();
  const { user } = useUser();

  const client = useStreamVideoClient();
  const { toast } = useToast();

  const meetingId = user?.id;

  const { call } = useGetCallById(meetingId!);

  const startRoom = async () => {
    if (!client || !user) return;

    const newCall = client.call("default", meetingId!);

    if (!call) {
      await newCall.getOrCreate({
        data: {
          starts_at: new Date().toISOString(),
          
        },
      });
    }

    router.push(`/meetings/${meetingId}?personal=true`);
  };

  const meetingLink = `${process.env.NEXT_PUBLIC_BASE_URL}/meetings/${meetingId}?personal=true`;

  return (
    <section className="flex size-full flex-col gap-10 text-white">
      <h1 className="text-xl font-bold lg:text-3xl">Personal Meeting Room</h1>
      <div className="flex w-full flex-col gap-8 xl:max-w-[900px]">
        <Table title="Topic" description={`${user?.username}'s Meeting Room`} />
        <Table title="Meeting ID" description={meetingId!} />
        <Table title="Invite Link" description={meetingLink} Icon={Copy}/>
      </div>
      <div className="flex gap-5">
        <Button className="bg-blue-1" onClick={startRoom}>
          Start Meeting
        </Button>
        <Button
          className="bg-dark-3"
          onClick={() => {
            navigator.clipboard.writeText(meetingLink);
            toast({
              title: "Link Copied",
            });
          }}
        >
          Copy Invitation
        </Button>
        <Button className="border-2 border-gray-600 rounded-sm ">
          <Edit className="w-5 h-5 mr-2"/> 
          <p className="text-base font-normal">
            Edit
          </p>
        </Button>
        <Button className="border-2 border-gray-600 rounded-sm">
          <Trash className="w-5 h-5 mr-2"/> 
          <p className="text-base font-normal">
            Delete
          </p>
        </Button>
      </div>
      <Separator className="border-[1px] border-gray-700"/>
      <Button
          className="bg-dark-3 p-4 w-52"
          onClick={() => {
            navigator.clipboard.writeText(meetingLink);
            toast({
              title: "Link Copied",
            });
          }}
        >
        <Plus className="w-5 h-5 mr-2"/>
        <p className="text-base font-normal">
          Create a new room
        </p>
      </Button>
    </section>
  );
};

export default PersonalRoom;