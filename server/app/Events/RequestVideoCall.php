<?php

   namespace App\Events;

   use App\Models\User;
   use Illuminate\Broadcasting\Channel;
   use Illuminate\Broadcasting\InteractsWithSockets;
   use Illuminate\Broadcasting\PrivateChannel;
   use Illuminate\Contracts\Broadcasting\ShouldBroadcastNow;
   use Illuminate\Foundation\Events\Dispatchable;
   use Illuminate\Queue\SerializesModels;

   class RequestVideoCall implements ShouldBroadcastNow
   {
       use Dispatchable, InteractsWithSockets, SerializesModels;

       public function __construct(public User $user, public User $fromUser, public string $peerId)
       {
       }

       public function broadcastOn(): array
       {
           return [
               new PrivateChannel("video-call.{$this->user->id}"),
           ];
       }

       public function broadcastWith(): array
       {
           return [
               'user' => [
                   'id' => $this->user->id,
                   'name' => $this->user->name,
                   'peerId' => $this->peerId,
                   'fromUser' => [
                       'id' => $this->fromUser->id,
                       'name' => $this->fromUser->name,
                   ],
               ],
           ];
       }
   }