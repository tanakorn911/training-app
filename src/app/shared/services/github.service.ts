import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface GitHubProfile {
  login: string;
  avatar_url: string;
  html_url: string;
  name: string;
  company: string | null;
  blog: string;
  location: string;
  email: string | null;
  bio: string;
  twitter_username: string | null;
  public_repos: number;
  public_gists: number;
  followers: number;
  following: number;
  created_at: string;
}

@Injectable({
  providedIn: 'root',
})
export class GitHubService {
  private readonly http = inject(HttpClient);
  private readonly API_URL = 'https://api.github.com/users/tanakorn911';

  getProfile(): Observable<GitHubProfile> {
    return this.http.get<GitHubProfile>(this.API_URL);
  }
}
