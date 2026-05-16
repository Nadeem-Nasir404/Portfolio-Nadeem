import { CommonModule } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { animate, query, stagger, style, transition, trigger } from '@angular/animations';
import { Experience, Resume } from '../models/resume';
import { ResumeService } from '../services/resume.service';

interface FeatureCard {
  eyebrow: string;
  title: string;
  text: string;
  points: string[];
}

interface StatCard {
  value: string;
  label: string;
}

interface ContactLink {
  label: string;
  value: string;
  href?: string;
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(24px)' }),
        animate('500ms cubic-bezier(0.22, 1, 0.36, 1)', style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ]),
    trigger('staggerList', [
      transition(':enter', [
        query(':enter', [
          style({ opacity: 0, transform: 'translateY(18px)' }),
          stagger(90, [
            animate('500ms cubic-bezier(0.22, 1, 0.36, 1)', style({ opacity: 1, transform: 'translateY(0)' }))
          ])
        ], { optional: true })
      ])
    ])
  ]
})
export class HomeComponent {
  private readonly resumeSvc = inject(ResumeService);
  private readonly title = inject(Title);
  private readonly meta = inject(Meta);

  readonly year = new Date().getFullYear();
  readonly resume = signal<Resume | null>(null);

  readonly featureCards: FeatureCard[] = [
    {
      eyebrow: 'Build',
      title: 'Enterprise systems with product-level polish',
      text: 'From ERP modules to operational dashboards, the focus stays on reliability, maintainability, and clean user flows.',
      points: ['Scalable .NET backends', 'Modern Angular and React frontends', 'Practical UX for internal teams']
    },
    {
      eyebrow: 'Optimize',
      title: 'Reporting stacks that move faster under load',
      text: 'Data pipelines, SQL tuning, and dashboard experiences are shaped to help teams reach decisions without friction.',
      points: ['Query and schema tuning', 'Real-time reporting flows', 'Cost-aware infrastructure choices']
    },
    {
      eyebrow: 'Deliver',
      title: 'Delivery systems that keep teams shipping',
      text: 'CI/CD automation, release discipline, and hands-on leadership help products grow without slowing engineering down.',
      points: ['Docker and pipeline workflows', 'Secure deployment habits', 'Cross-functional collaboration']
    }
  ];

  readonly stats = computed<StatCard[]>(() => {
    const resume = this.resume();

    return [
      {
        value: `${this.getYearsOfExperience(resume?.experience ?? [])}+`,
        label: 'Years shipping production software'
      },
      {
        value: `${resume?.projects?.length ?? 0}`,
        label: 'Portfolio case studies'
      },
      {
        value: `${resume?.tools?.length ?? 0}`,
        label: 'Core tools in daily delivery'
      }
    ];
  });

  readonly featuredProjects = computed(() => (this.resume()?.projects ?? []).slice(0, 4));

  readonly stackRibbon = computed(() => {
    const resume = this.resume();
    const source = [
      ...(resume?.skills ?? []),
      ...((resume?.experience ?? []).flatMap((item) => item.technologies ?? [])),
      ...(resume?.tools ?? [])
    ];

    const unique = Array.from(new Set(source)).slice(0, 14);
    return [...unique, ...unique];
  });

  readonly contactLinks = computed<ContactLink[]>(() => {
    const resume = this.resume();

    return [
      {
        label: 'Email',
        value: resume?.email ?? '',
        href: resume?.email ? `mailto:${resume.email}` : undefined
      },
      {
        label: 'Phone',
        value: resume?.phone ?? ''
      },
      {
        label: 'Website',
        value: resume?.website ?? '',
        href: resume?.website ?? undefined
      },
      {
        label: 'LinkedIn',
        value: resume?.linkedin ?? '',
        href: resume?.linkedin ?? undefined
      },
      {
        label: 'GitHub',
        value: resume?.github ?? '',
        href: resume?.github ?? undefined
      }
    ].filter((item) => item.value);
  });

  constructor() {
    this.resumeSvc.getResume().subscribe((resume) => {
      this.resume.set(resume);

      if (resume?.name) {
        this.title.setTitle(`${resume.name} | ${resume.title || 'Portfolio'}`);
      }

      this.meta.updateTag({
        name: 'description',
        content: resume?.summary || 'Developer portfolio'
      });
    });
  }

  trackByText(_: number, item: string): string {
    return item;
  }

  private getYearsOfExperience(experience: Experience[]): number {
    const years = experience
      .map((item) => this.extractYear(item.start))
      .filter((value): value is number => value !== null);

    if (!years.length) {
      return 6;
    }

    const earliest = Math.min(...years);
    return Math.max(this.year - earliest, 1);
  }

  private extractYear(value?: string): number | null {
    const match = value?.match(/\b(19|20)\d{2}\b/);
    return match ? Number(match[0]) : null;
  }
}
