src/components/LoginForm.tsx:23:29 - error TS2339: Property 'email' does not exist on type '{ value: { email: string; password: string; }; formApi: FormApi<{ email: string; password: string; }, undefined>; }'.

23         await signIn(values.email, values.password)
                               ~~~~~

src/components/LoginForm.tsx:23:43 - error TS2339: Property 'password' does not exist on type '{ value: { email: string; password: string; }; formApi: FormApi<{ email: string; password: string; }, undefined>; }'.

23         await signIn(values.email, values.password)
                                             ~~~~~~~~

src/components/LoginForm.tsx:40:22 - error TS2339: Property 'getFieldProps' does not exist on type 'FormApi<{ email: string; password: string; }, undefined>'.

40             {...form.getFieldProps('email')}
                        ~~~~~~~~~~~~~

src/components/LoginForm.tsx:42:17 - error TS2339: Property 'getFieldError' does not exist on type 'FormApi<{ email: string; password: string; }, undefined>'.

42           {form.getFieldError('email') && (
                   ~~~~~~~~~~~~~

src/components/LoginForm.tsx:44:21 - error TS2339: Property 'getFieldError' does not exist on type 'FormApi<{ email: string; password: string; }, undefined>'.

44               {form.getFieldError('email')}
                       ~~~~~~~~~~~~~

src/components/LoginForm.tsx:54:22 - error TS2339: Property 'getFieldProps' does not exist on type 'FormApi<{ email: string; password: string; }, undefined>'.

54             {...form.getFieldProps('password')}
                        ~~~~~~~~~~~~~

src/components/LoginForm.tsx:56:17 - error TS2339: Property 'getFieldError' does not exist on type 'FormApi<{ email: string; password: string; }, undefined>'.

56           {form.getFieldError('password') && (
                   ~~~~~~~~~~~~~

src/components/LoginForm.tsx:58:21 - error TS2339: Property 'getFieldError' does not exist on type 'FormApi<{ email: string; password: string; }, undefined>'.

58               {form.getFieldError('password')}
                       ~~~~~~~~~~~~~

src/components/LoginForm.tsx:65:26 - error TS2339: Property 'isSubmitting' does not exist on type 'FormApi<{ email: string; password: string; }, undefined>'.

65           disabled={form.isSubmitting}
                            ~~~~~~~~~~~~

src/components/LoginForm.tsx:67:17 - error TS2339: Property 'isSubmitting' does not exist on type 'FormApi<{ email: string; password: string; }, undefined>'.

67           {form.isSubmitting ? 'Logging in...' : 'Login'}
                   ~~~~~~~~~~~~

src/components/RegisterForm.tsx:31:25 - error TS2339: Property 'email' does not exist on type '{ value: { email: string; company_name: string; company_kvk: string; phone: string; password: string; }; formApi: FormApi<{ email: string; company_name: string; company_kvk: string; phone: string; password: string; }, undefined>; }'.

31           email: values.email,
                           ~~~~~

src/components/RegisterForm.tsx:32:28 - error TS2339: Property 'password' does not exist on type '{ value: { email: string; company_name: string; company_kvk: string; phone: string; password: string; }; formApi: FormApi<{ email: string; company_name: string; company_kvk: string; phone: string; password: string; }, undefined>; }'.

32           password: values.password,
                              ~~~~~~~~

src/components/RegisterForm.tsx:33:32 - error TS2339: Property 'company_name' does not exist on type '{ value: { email: string; company_name: string; company_kvk: string; phone: string; password: string; }; formApi: FormApi<{ email: string; company_name: string; company_kvk: string; phone: string; password: string; }, undefined>; }'.

33           company_name: values.company_name,
                                  ~~~~~~~~~~~~

src/components/RegisterForm.tsx:34:31 - error TS2339: Property 'company_kvk' does not exist on type '{ value: { email: string; company_name: string; company_kvk: string; phone: string; password: string; }; formApi: FormApi<{ email: string; company_name: string; company_kvk: string; phone: string; password: string; }, undefined>; }'.

34           company_kvk: values.company_kvk,
                                 ~~~~~~~~~~~

src/components/RegisterForm.tsx:35:25 - error TS2339: Property 'phone' does not exist on type '{ value: { email: string; company_name: string; company_kvk: string; phone: string; password: string; }; formApi: FormApi<{ email: string; company_name: string; company_kvk: string; phone: string; password: string; }, undefined>; }'.

35           phone: values.phone
                           ~~~~~

src/components/RegisterForm.tsx:50:23 - error TS2339: Property 'getFieldError' does not exist on type 'FormApi<{ email: string; company_name: string; company_kvk: string; phone: string; password: string; }, undefined>'.

50           error={form.getFieldError('email')}
                         ~~~~~~~~~~~~~

src/components/RegisterForm.tsx:54:22 - error TS2339: Property 'getFieldProps' does not exist on type 'FormApi<{ email: string; company_name: string; company_kvk: string; phone: string; password: string; }, undefined>'.

54             {...form.getFieldProps('email')}
                        ~~~~~~~~~~~~~

src/components/RegisterForm.tsx:60:23 - error TS2339: Property 'getFieldError' does not exist on type 'FormApi<{ email: string; company_name: string; company_kvk: string; phone: string; password: string; }, undefined>'.

60           error={form.getFieldError('password')}
                         ~~~~~~~~~~~~~

src/components/RegisterForm.tsx:64:22 - error TS2339: Property 'getFieldProps' does not exist on type 'FormApi<{ email: string; company_name: string; company_kvk: string; phone: string; password: string; }, undefined>'.

64             {...form.getFieldProps('password')}
                        ~~~~~~~~~~~~~

src/components/RegisterForm.tsx:70:23 - error TS2339: Property 'getFieldError' does not exist on type 'FormApi<{ email: string; company_name: string; company_kvk: string; phone: string; password: string; }, undefined>'.

70           error={form.getFieldError('company_name')}
                         ~~~~~~~~~~~~~

src/components/RegisterForm.tsx:73:22 - error TS2339: Property 'getFieldProps' does not exist on type 'FormApi<{ email: string; company_name: string; company_kvk: string; phone: string; password: string; }, undefined>'.

73             {...form.getFieldProps('company_name')}
                        ~~~~~~~~~~~~~

src/components/RegisterForm.tsx:79:23 - error TS2339: Property 'getFieldError' does not exist on type 'FormApi<{ email: string; company_name: string; company_kvk: string; phone: string; password: string; }, undefined>'.

79           error={form.getFieldError('company_kvk')}
                         ~~~~~~~~~~~~~

src/components/RegisterForm.tsx:82:22 - error TS2339: Property 'getFieldProps' does not exist on type 'FormApi<{ email: string; company_name: string; company_kvk: string; phone: string; password: string; }, undefined>'.

82             {...form.getFieldProps('company_kvk')}
                        ~~~~~~~~~~~~~

src/components/RegisterForm.tsx:88:23 - error TS2339: Property 'getFieldError' does not exist on type 'FormApi<{ email: string; company_name: string; company_kvk: string; phone: string; password: string; }, undefined>'.

88           error={form.getFieldError('phone')}
                         ~~~~~~~~~~~~~

src/components/RegisterForm.tsx:92:22 - error TS2339: Property 'getFieldProps' does not exist on type 'FormApi<{ email: string; company_name: string; company_kvk: string; phone: string; password: string; }, undefined>'.

92             {...form.getFieldProps('phone')}
                        ~~~~~~~~~~~~~

src/components/RegisterForm.tsx:98:26 - error TS2339: Property 'isSubmitting' does not exist on type 'FormApi<{ email: string; company_name: string; company_kvk: string; phone: string; password: string; }, undefined>'.

98           disabled={form.isSubmitting}
                            ~~~~~~~~~~~~

src/components/RegisterForm.tsx:100:17 - error TS2339: Property 'isSubmitting' does not exist on type 'FormApi<{ email: string; company_name: string; company_kvk: string; phone: string; password: string; }, undefined>'.

100           {form.isSubmitting ? 'Registering...' : 'Register'}
                    ~~~~~~~~~~~~

src/components/credits/TransactionHistory.tsx:4:15 - error TS2305: Module '"@/types"' has no exported member 'Transaction'.

4 import type { Transaction } from '@/types'
                ~~~~~~~~~~~

src/components/dashboard/AdminDashboardLayout.tsx:19:8 - error TS2613: Module '"/home/websiteofferteaanvragen/htdocs/websiteofferteaanvragen.nl/src/components/NotificationBell"' has no default export. Did you mean to use 'import { NotificationBell } from "/home/websiteofferteaanvragen/htdocs/websiteofferteaanvragen.nl/src/components/NotificationBell"' instead?

19 import NotificationBell from '../NotificationBell';
          ~~~~~~~~~~~~~~~~

src/components/dashboard/AdminLeadCard.tsx:29:61 - error TS2339: Property 'call_status' does not exist on type 'Lead'.

29   onCallStatusChange: (id: string, status: NonNullable<Lead['call_status']>) => void;
                                                               ~~~~~~~~~~~~~

src/components/dashboard/AdminLeadCard.tsx:51:56 - error TS2339: Property 'call_status' does not exist on type 'Lead'.

51   const getCallStatusColor = (status: NonNullable<Lead['call_status']>) => {
                                                          ~~~~~~~~~~~~~

src/components/dashboard/AdminLeadCard.tsx:100:61 - error TS2339: Property 'email' does not exist on type 'Lead'.

100               <span className="text-sm text-gray-600">{lead.email || 'Onbekend'}</span>
                                                                ~~~~~

src/components/dashboard/AdminLeadCard.tsx:104:61 - error TS2339: Property 'phone' does not exist on type 'Lead'.

104               <span className="text-sm text-gray-600">{lead.phone || 'Onbekend'}</span>
                                                                ~~~~~

src/components/dashboard/AdminLeadCard.tsx:126:17 - error TS2339: Property 'ai_verified' does not exist on type 'Lead'.

126           {lead.ai_verified ? (
                    ~~~~~~~~~~~

src/components/dashboard/AdminLeadCard.tsx:141:27 - error TS2339: Property 'call_status' does not exist on type 'Lead'.

141               value={lead.call_status || 'not_called'}
                              ~~~~~~~~~~~

src/components/dashboard/AdminLeadCard.tsx:143:71 - error TS2339: Property 'call_status' does not exist on type 'Lead'.

143                 onCallStatusChange(lead.id, value as NonNullable<Lead['call_status']>)
                                                                          ~~~~~~~~~~~~~

src/components/dashboard/AdminLeadCard.tsx:151:30 - error TS2339: Property 'call_status' does not exist on type 'Lead'.

151                         lead.call_status || 'not_called'
                                 ~~~~~~~~~~~

src/components/dashboard/AdminLeadCard.tsx:154:45 - error TS2339: Property 'call_status' does not exist on type 'Lead'.

154                     {getCallStatusText(lead.call_status || 'not_called')}
                                                ~~~~~~~~~~~

src/components/dashboard/LeadCard.tsx:32:62 - error TS2339: Property 'call_status' does not exist on type 'Lead'.

32   onCallStatusChange?: (id: string, status: NonNullable<Lead['call_status']>) => void;
                                                                ~~~~~~~~~~~~~

src/components/dashboard/LeadCard.tsx:105:25 - error TS2339: Property 'email' does not exist on type 'Lead'.

105                   {lead.email || 'Geen email'}
                            ~~~~~

src/components/dashboard/LeadCard.tsx:111:25 - error TS2339: Property 'phone' does not exist on type 'Lead'.

111                   {lead.phone || 'Geen telefoon'}
                            ~~~~~

src/components/dashboard/LeadCard.tsx:137:31 - error TS2339: Property 'call_status' does not exist on type 'Lead'.

137                   value={lead.call_status || 'not_called'}
                                  ~~~~~~~~~~~

src/components/dashboard/LeadCard.tsx:139:77 - error TS2339: Property 'call_status' does not exist on type 'Lead'.

139                     onCallStatusChange?.(lead.id, value as NonNullable<Lead['call_status']>)
                                                                                ~~~~~~~~~~~~~

src/components/dashboard/LeadCard.tsx:145:83 - error TS2339: Property 'call_status' does not exist on type 'Lead'.

145                         <Phone className={`h-4 w-4 mr-2 ${getCallStatusColor(lead.call_status || 'not_called')}`} />
                                                                                      ~~~~~~~~~~~

src/components/dashboard/LeadCard.tsx:146:31 - error TS2339: Property 'call_status' does not exist on type 'Lead'.

146                         {lead.call_status === 'called' ? 'Gebeld' :
                                  ~~~~~~~~~~~

src/components/dashboard/LeadCard.tsx:147:31 - error TS2339: Property 'call_status' does not exist on type 'Lead'.

147                          lead.call_status === 'unreachable' ? 'Onbereikbaar' :
                                  ~~~~~~~~~~~

src/components/dashboard/LeadTable.tsx:17:61 - error TS2339: Property 'call_status' does not exist on type 'Lead'.

17   onCallStatusChange: (id: string, status: NonNullable<Lead['call_status']>) => void;
                                                               ~~~~~~~~~~~~~

src/components/dashboard/LeadTable.tsx:97:62 - error TS2339: Property 'contact_name' does not exist on type 'Lead'.

97                 <div className="text-sm text-gray-900">{lead.contact_name || 'Onbekend'}</div>
                                                                ~~~~~~~~~~~~

src/components/dashboard/LeadTable.tsx:98:62 - error TS2339: Property 'email' does not exist on type 'Lead'.

98                 <div className="text-sm text-gray-500">{lead.email || 'Geen email'}</div>
                                                                ~~~~~

src/components/dashboard/LeadTable.tsx:109:33 - error TS2339: Property 'call_status' does not exist on type 'Lead'.

109                     value={lead.call_status || 'not_called'}
                                    ~~~~~~~~~~~

src/components/dashboard/LeadTable.tsx:111:77 - error TS2339: Property 'call_status' does not exist on type 'Lead'.

111                       onCallStatusChange(lead.id, value as NonNullable<Lead['call_status']>)
                                                                                ~~~~~~~~~~~~~

src/components/dashboard/LeadTable.tsx:117:85 - error TS2339: Property 'call_status' does not exist on type 'Lead'.

117                           <Phone className={`h-4 w-4 mr-2 ${getCallStatusColor(lead.call_status || 'not_called')}`} />
                                                                                        ~~~~~~~~~~~

src/components/dashboard/LeadTable.tsx:118:33 - error TS2339: Property 'call_status' does not exist on type 'Lead'.

118                           {lead.call_status === 'called' ? 'Called' :
                                    ~~~~~~~~~~~

src/components/dashboard/LeadTable.tsx:119:33 - error TS2339: Property 'call_status' does not exist on type 'Lead'.

119                            lead.call_status === 'unreachable' ? 'Unreachable' :
                                    ~~~~~~~~~~~

src/components/dashboard/MarketerDashboardLayout.tsx:18:8 - error TS2613: Module '"/home/websiteofferteaanvragen/htdocs/websiteofferteaanvragen.nl/src/components/NotificationBell"' has no default export. Did you mean to use 'import { NotificationBell } from "/home/websiteofferteaanvragen/htdocs/websiteofferteaanvragen.nl/src/components/NotificationBell"' instead?

18 import NotificationBell from '../NotificationBell';
          ~~~~~~~~~~~~~~~~

src/components/dashboard/TransactionHistory.tsx:14:15 - error TS2305: Module '"@/types"' has no exported member 'Transaction'.

14 import type { Transaction } from '@/types';
                 ~~~~~~~~~~~

src/components/notifications/CreditNotifications.tsx:9:15 - error TS2339: Property 'credits' does not exist on type 'UserWithRole'.

9     if (user?.credits < 5) {
                ~~~~~~~

src/components/notifications/CreditNotifications.tsx:12:13 - error TS2339: Property 'credits' does not exist on type 'UserWithRole'.

12   }, [user?.credits])
               ~~~~~~~

src/pages/AdminLogin.tsx:31:11 - error TS1345: An expression of type 'void' cannot be tested for truthiness.

31       if (adminUser) {
             ~~~~~~~~~

src/pages/LeadDetailsPage.tsx:155:5 - error TS2339: Property 'email' does not exist on type 'Lead'.

155     email,
        ~~~~~

src/pages/LeadDetailsPage.tsx:156:5 - error TS2339: Property 'phone' does not exist on type 'Lead'.

156     phone,
        ~~~~~

src/pages/LeadDetailsPage.tsx:157:5 - error TS2339: Property 'location' does not exist on type 'Lead'.

157     location,
        ~~~~~~~~

src/pages/LeadDetailsPage.tsx:158:5 - error TS2339: Property 'technical_requirements' does not exist on type 'Lead'.

158     technical_requirements,
        ~~~~~~~~~~~~~~~~~~~~~~

src/pages/LeadDetailsPage.tsx:159:5 - error TS2339: Property 'call_status' does not exist on type 'Lead'.

159     call_status
        ~~~~~~~~~~~

src/pages/LeadsPage.tsx:9:10 - error TS2440: Import declaration conflicts with local declaration of 'Lead'.

9 import { Lead, Quote } from '../types';
           ~~~~

src/pages/LeadsPage.tsx:9:16 - error TS2305: Module '"../types"' has no exported member 'Quote'.

9 import { Lead, Quote } from '../types';
                 ~~~~~

src/pages/LeadsPage.tsx:73:48 - error TS2304: Cannot find name 'handleViewLead'.

73         <Button variant="ghost" onClick={() => handleViewLead(lead.id)}>
                                                  ~~~~~~~~~~~~~~

src/pages/LeadsPage.tsx:97:5 - error TS2322: Type 'Lead[] | undefined' is not assignable to type 'Lead[]'.
  Type 'undefined' is not assignable to type 'Lead[]'.

97     data: leads,
       ~~~~

  src/lib/table.ts:10:3
    10   data: TData[]
         ~~~~
    The expected type comes from property 'data' which is declared here on type 'UseTableProps<Lead>'

src/pages/LeadsPage.tsx:98:5 - error TS2322: Type 'import("/home/websiteofferteaanvragen/htdocs/websiteofferteaanvragen.nl/node_modules/@tanstack/table-core/build/lib/types").ColumnDef<Lead>[]' is not assignable to type 'import("/home/websiteofferteaanvragen/htdocs/websiteofferteaanvragen.nl/node_modules/@tanstack/table-core/build/lib/types").ColumnDef<import("/home/websiteofferteaanvragen/htdocs/websiteofferteaanvragen.nl/src/types").Lead>[]'.
  Type 'import("/home/websiteofferteaanvragen/htdocs/websiteofferteaanvragen.nl/node_modules/@tanstack/table-core/build/lib/types").ColumnDef<Lead>' is not assignable to type 'import("/home/websiteofferteaanvragen/htdocs/websiteofferteaanvragen.nl/node_modules/@tanstack/table-core/build/lib/types").ColumnDef<import("/home/websiteofferteaanvragen/htdocs/websiteofferteaanvragen.nl/src/types").Lead>'.
    Type 'ColumnDefBase<Lead, unknown> & StringHeaderIdentifier' is not assignable to type 'ColumnDef<Lead>'.
      Type 'ColumnDefBase<Lead, unknown> & StringHeaderIdentifier' is not assignable to type 'AccessorFnColumnDefBase<Lead, unknown> & IdIdentifier<Lead, unknown>'.
        Property 'accessorFn' is missing in type 'ColumnDefBase<Lead, unknown> & StringHeaderIdentifier' but required in type 'AccessorFnColumnDefBase<Lead, unknown>'.

98     columns,
       ~~~~~~~

  node_modules/@tanstack/table-core/build/lib/types.d.ts:98:5
    98     accessorFn: AccessorFn<TData, TValue>;
           ~~~~~~~~~~
    'accessorFn' is declared here.
  src/lib/table.ts:11:3
    11   columns: ColumnDef<TData>[]
         ~~~~~~~
    The expected type comes from property 'columns' which is declared here on type 'UseTableProps<Lead>'

src/pages/LeadsPage.tsx:164:14 - error TS2339: Property 'company_name' does not exist on type 'Lead'.

164         lead.company_name.toLowerCase().includes(filters.search.toLowerCase()) ||
                 ~~~~~~~~~~~~

src/pages/LeadsPage.tsx:165:14 - error TS2339: Property 'project_description' does not exist on type 'Lead'.

165         lead.project_description.toLowerCase().includes(filters.search.toLowerCase());
                 ~~~~~~~~~~~~~~~~~~~

src/pages/LeadsPage.tsx:167:58 - error TS2339: Property 'budget_range' does not exist on type 'Lead'.

167       const matchesBudget = !filters.budgetRange || lead.budget_range === filters.budgetRange;
                                                             ~~~~~~~~~~~~

src/pages/LeadsPage.tsx:168:57 - error TS2339: Property 'timeline' does not exist on type 'Lead'.

168       const matchesTimeline = !filters.timeline || lead.timeline === filters.timeline;
                                                            ~~~~~~~~

src/pages/LeadsPage.tsx:218:40 - error TS2353: Object literal may only specify known properties, and 'data' does not exist in type 'Partial<Lead>'.

218     await updateLead.mutateAsync({ id, data })
                                           ~~~~

src/pages/LeadsPage.tsx:313:56 - error TS2339: Property 'company_name' does not exist on type 'Lead'.

313                       <span className="truncate">{lead.company_name}</span>
                                                           ~~~~~~~~~~~~

src/pages/LeadsPage.tsx:321:29 - error TS2339: Property 'project_description' does not exist on type 'Lead'.

321                       {lead.project_description}
                                ~~~~~~~~~~~~~~~~~~~

src/pages/LeadsPage.tsx:327:37 - error TS2339: Property 'budget_range' does not exist on type 'Lead'.

327                         <span>{lead.budget_range}</span>
                                        ~~~~~~~~~~~~

src/pages/LeadsPage.tsx:331:37 - error TS2339: Property 'timeline' does not exist on type 'Lead'.

331                         <span>{lead.timeline}</span>
                                        ~~~~~~~~

src/pages/LeadsPage.tsx:335:37 - error TS2339: Property 'location' does not exist on type 'Lead'.

335                         <span>{lead.location || 'Nederland'}</span>
                                        ~~~~~~~~

src/pages/LeadsPage.tsx:385:17 - error TS2740: Type 'Lead' is missing the following properties from type 'Lead': company_name, description, project_description, budget_range, and 3 more.

385                 lead={quote.leads as Lead}
                    ~~~~

  src/components/dashboard/LeadCard.tsx:30:3
    30   lead: Lead;
         ~~~~
    The expected type comes from property 'lead' which is declared here on type 'IntrinsicAttributes & LeadCardProps'

src/pages/LeadsPage.tsx:403:32 - error TS2339: Property 'isLoading' does not exist on type 'UseMutationResult<never, Error, Partial<Lead>, unknown>'.
  Property 'isLoading' does not exist on type 'Override<MutationObserverIdleResult<never, Error, Partial<Lead>, unknown>, { mutate: UseMutateFunction<never, Error, Partial<Lead>, unknown>; }> & { ...; }'.

403         isUpdating={updateLead.isLoading}
                                   ~~~~~~~~~

src/pages/MarketerDashboard.tsx:19:16 - error TS2305: Module '"../types"' has no exported member 'Quote'.

19 import { Lead, Quote } from '../types';
                  ~~~~~

src/pages/SubscriptionPage.tsx:181:8 - error TS2741: Property 'transactions' is missing in type '{}' but required in type 'TransactionHistoryProps'.

181       <TransactionHistory />
           ~~~~~~~~~~~~~~~~~~

  src/components/dashboard/TransactionHistory.tsx:17:3
    17   transactions: Transaction[];
         ~~~~~~~~~~~~
    'transactions' is declared here.

src/pages/admin/AdminSettingsPage.tsx:149:25 - error TS2322: Type 'number | boolean' is not assignable to type 'boolean | undefined'.
  Type 'number' is not assignable to type 'boolean | undefined'.

149                         checked={settings.lead_matching[key as keyof typeof settings.lead_matching]}
                            ~~~~~~~

  node_modules/@types/react/index.d.ts:3369:9
    3369         checked?: boolean | undefined;
                 ~~~~~~~
    The expected type comes from property 'checked' which is declared here on type 'DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>'

src/pages/admin/AdminSettingsPage.tsx:221:25 - error TS2322: Type 'number | boolean' is not assignable to type 'boolean | undefined'.
  Type 'number' is not assignable to type 'boolean | undefined'.

221                         checked={settings.ai_verification[key as keyof typeof settings.ai_verification]}
                            ~~~~~~~

  node_modules/@types/react/index.d.ts:3369:9
    3369         checked?: boolean | undefined;
                 ~~~~~~~
    The expected type comes from property 'checked' which is declared here on type 'DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>'

src/pages/admin/settings/RolesPage.tsx:22:16 - error TS2345: Argument of type 'any[]' is not assignable to parameter of type 'SetStateAction<never[]>'.
  Type 'any[]' is not assignable to type 'never[]'.
    Type 'any' is not assignable to type 'never'.

22       setRoles(data || []);
                  ~~~~~~~~~~

src/pages/admin/settings/RolesPage.tsx:51:29 - error TS7006: Parameter 'id' implicitly has an 'any' type.

51   const deleteRole = async (id) => {
                               ~~

src/pages/admin/settings/RolesPage.tsx:89:33 - error TS2339: Property 'id' does not exist on type 'never'.

89             <TableRow key={role.id}>
                                   ~~

src/pages/admin/settings/RolesPage.tsx:90:32 - error TS2339: Property 'id' does not exist on type 'never'.

90               <TableCell>{role.id}</TableCell>
                                  ~~

src/pages/admin/settings/RolesPage.tsx:91:32 - error TS2339: Property 'name' does not exist on type 'never'.

91               <TableCell>{role.name}</TableCell>
                                  ~~~~

src/pages/admin/settings/RolesPage.tsx:93:78 - error TS2339: Property 'id' does not exist on type 'never'.

93                 <Button variant="destructive" onClick={() => deleteRole(role.id)} disabled={loading}>
                                                                                ~~

src/pages/settings/PortfolioPage.tsx:58:69 - error TS2345: Argument of type '{ title: string; description: string; url: string; technologies: never[]; budget_range: string; completion_date: string; project_type: string; industry: string; team_size: number; development_time: number; client_testimonial: string; expertise_level: "medior"; }' is not assignable to parameter of type 'Portfolio | (() => Portfolio)'.
  Type '{ title: string; description: string; url: string; technologies: never[]; budget_range: string; completion_date: string; project_type: string; industry: string; team_size: number; development_time: number; client_testimonial: string; expertise_level: "medior"; }' is missing the following properties from type 'Portfolio': id, images

 58   const [newPortfolio, setNewPortfolio] = React.useState<Portfolio>({
                                                                        ~
 59     title: '',
    ~~~~~~~~~~~~~~
...
 70     expertise_level: 'medior',
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 71   });
    ~~~

src/pages/settings/PortfolioPage.tsx:105:51 - error TS2339: Property 'split' does not exist on type 'string[]'.

105           technologies: newPortfolio.technologies.split(',').map(t => t.trim()),
                                                      ~~~~~

src/pages/settings/PortfolioPage.tsx:105:66 - error TS7006: Parameter 't' implicitly has an 'any' type.

105           technologies: newPortfolio.technologies.split(',').map(t => t.trim()),
                                                                     ~

src/pages/settings/PortfolioPage.tsx:121:23 - error TS2345: Argument of type '{ title: string; description: string; url: string; technologies: never[]; budget_range: string; completion_date: string; project_type: string; industry: string; team_size: number; development_time: number; client_testimonial: string; expertise_level: "medior"; }' is not assignable to parameter of type 'SetStateAction<Portfolio>'.
  Type '{ title: string; description: string; url: string; technologies: never[]; budget_range: string; completion_date: string; project_type: string; industry: string; team_size: number; development_time: number; client_testimonial: string; expertise_level: "medior"; }' is missing the following properties from type 'Portfolio': id, images

121       setNewPortfolio({
                          ~
122         title: '',
    ~~~~~~~~~~~~~~~~~~
...
133         expertise_level: 'medior',
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
134       });
    ~~~~~~~

src/router/index.ts:2:10 - error TS2305: Module '"./routes"' has no exported member 'rootRoute'.

2 import { rootRoute } from './routes'
           ~~~~~~~~~

src/services/aiService.ts:85:12 - error TS2339: Property 'max_quotes' does not exist on type 'Lead'.

85       lead.max_quotes / 5,
              ~~~~~~~~~~

src/services/aiService.ts:86:12 - error TS2339: Property 'phone' does not exist on type 'Lead'.

86       lead.phone && lead.email ? 1 : 0,
              ~~~~~

src/services/aiService.ts:86:26 - error TS2339: Property 'email' does not exist on type 'Lead'.

86       lead.phone && lead.email ? 1 : 0,
                            ~~~~~


Found 99 errors in 20 files.

Errors  Files
    10  src/components/LoginForm.tsx:23
    17  src/components/RegisterForm.tsx:31
     1  src/components/credits/TransactionHistory.tsx:4
     1  src/components/dashboard/AdminDashboardLayout.tsx:19
     9  src/components/dashboard/AdminLeadCard.tsx:29
     8  src/components/dashboard/LeadCard.tsx:32
     8  src/components/dashboard/LeadTable.tsx:17
     1  src/components/dashboard/MarketerDashboardLayout.tsx:18
     1  src/components/dashboard/TransactionHistory.tsx:14
     2  src/components/notifications/CreditNotifications.tsx:9
     1  src/pages/AdminLogin.tsx:31
     5  src/pages/LeadDetailsPage.tsx:155
    17  src/pages/LeadsPage.tsx:9
     1  src/pages/MarketerDashboard.tsx:19
     1  src/pages/SubscriptionPage.tsx:181
     2  src/pages/admin/AdminSettingsPage.tsx:149
     6  src/pages/admin/settings/RolesPage.tsx:22
     4  src/pages/settings/PortfolioPage.tsx:58
     1  src/router/index.ts:2
     3  src/services/aiService.ts:85
root@Lokale-Loodgieters:/home/websiteofferteaanvragen/htdocs/websiteofferteaanvragen.nl# npm run build

> websiteofferteaanvragen@1.0.0 build
> tsc && vite build

src/components/LoginForm.tsx:23:29 - error TS2339: Property 'email' does not exist on type '{ value: { email: string; password: string; }; formApi: FormApi<{ email: string; password: string; }, undefined>; }'.

23         await signIn(values.email, values.password)
                               ~~~~~

src/components/LoginForm.tsx:23:43 - error TS2339: Property 'password' does not exist on type '{ value: { email: string; password: string; }; formApi: FormApi<{ email: string; password: string; }, undefined>; }'.

23         await signIn(values.email, values.password)
                                             ~~~~~~~~

src/components/LoginForm.tsx:40:22 - error TS2339: Property 'getFieldProps' does not exist on type 'FormApi<{ email: string; password: string; }, undefined>'.

40             {...form.getFieldProps('email')}
                        ~~~~~~~~~~~~~

src/components/LoginForm.tsx:42:17 - error TS2339: Property 'getFieldError' does not exist on type 'FormApi<{ email: string; password: string; }, undefined>'.

42           {form.getFieldError('email') && (
                   ~~~~~~~~~~~~~

src/components/LoginForm.tsx:44:21 - error TS2339: Property 'getFieldError' does not exist on type 'FormApi<{ email: string; password: string; }, undefined>'.

44               {form.getFieldError('email')}
                       ~~~~~~~~~~~~~

src/components/LoginForm.tsx:54:22 - error TS2339: Property 'getFieldProps' does not exist on type 'FormApi<{ email: string; password: string; }, undefined>'.

54             {...form.getFieldProps('password')}
                        ~~~~~~~~~~~~~

src/components/LoginForm.tsx:56:17 - error TS2339: Property 'getFieldError' does not exist on type 'FormApi<{ email: string; password: string; }, undefined>'.

56           {form.getFieldError('password') && (
                   ~~~~~~~~~~~~~

src/components/LoginForm.tsx:58:21 - error TS2339: Property 'getFieldError' does not exist on type 'FormApi<{ email: string; password: string; }, undefined>'.

58               {form.getFieldError('password')}
                       ~~~~~~~~~~~~~

src/components/LoginForm.tsx:65:26 - error TS2339: Property 'isSubmitting' does not exist on type 'FormApi<{ email: string; password: string; }, undefined>'.

65           disabled={form.isSubmitting}
                            ~~~~~~~~~~~~

src/components/LoginForm.tsx:67:17 - error TS2339: Property 'isSubmitting' does not exist on type 'FormApi<{ email: string; password: string; }, undefined>'.

67           {form.isSubmitting ? 'Logging in...' : 'Login'}
                   ~~~~~~~~~~~~

src/components/RegisterForm.tsx:31:25 - error TS2339: Property 'email' does not exist on type '{ value: { email: string; company_name: string; company_kvk: string; phone: string; password: string; }; formApi: FormApi<{ email: string; company_name: string; company_kvk: string; phone: string; password: string; }, undefined>; }'.

31           email: values.email,
                           ~~~~~

src/components/RegisterForm.tsx:32:28 - error TS2339: Property 'password' does not exist on type '{ value: { email: string; company_name: string; company_kvk: string; phone: string; password: string; }; formApi: FormApi<{ email: string; company_name: string; company_kvk: string; phone: string; password: string; }, undefined>; }'.

32           password: values.password,
                              ~~~~~~~~

src/components/RegisterForm.tsx:33:32 - error TS2339: Property 'company_name' does not exist on type '{ value: { email: string; company_name: string; company_kvk: string; phone: string; password: string; }; formApi: FormApi<{ email: string; company_name: string; company_kvk: string; phone: string; password: string; }, undefined>; }'.

33           company_name: values.company_name,
                                  ~~~~~~~~~~~~

src/components/RegisterForm.tsx:34:31 - error TS2339: Property 'company_kvk' does not exist on type '{ value: { email: string; company_name: string; company_kvk: string; phone: string; password: string; }; formApi: FormApi<{ email: string; company_name: string; company_kvk: string; phone: string; password: string; }, undefined>; }'.

34           company_kvk: values.company_kvk,
                                 ~~~~~~~~~~~

src/components/RegisterForm.tsx:35:25 - error TS2339: Property 'phone' does not exist on type '{ value: { email: string; company_name: string; company_kvk: string; phone: string; password: string; }; formApi: FormApi<{ email: string; company_name: string; company_kvk: string; phone: string; password: string; }, undefined>; }'.

35           phone: values.phone
                           ~~~~~

src/components/RegisterForm.tsx:50:23 - error TS2339: Property 'getFieldError' does not exist on type 'FormApi<{ email: string; company_name: string; company_kvk: string; phone: string; password: string; }, undefined>'.

50           error={form.getFieldError('email')}
                         ~~~~~~~~~~~~~

src/components/RegisterForm.tsx:54:22 - error TS2339: Property 'getFieldProps' does not exist on type 'FormApi<{ email: string; company_name: string; company_kvk: string; phone: string; password: string; }, undefined>'.

54             {...form.getFieldProps('email')}
                        ~~~~~~~~~~~~~

src/components/RegisterForm.tsx:60:23 - error TS2339: Property 'getFieldError' does not exist on type 'FormApi<{ email: string; company_name: string; company_kvk: string; phone: string; password: string; }, undefined>'.

60           error={form.getFieldError('password')}
                         ~~~~~~~~~~~~~

src/components/RegisterForm.tsx:64:22 - error TS2339: Property 'getFieldProps' does not exist on type 'FormApi<{ email: string; company_name: string; company_kvk: string; phone: string; password: string; }, undefined>'.

64             {...form.getFieldProps('password')}
                        ~~~~~~~~~~~~~

src/components/RegisterForm.tsx:70:23 - error TS2339: Property 'getFieldError' does not exist on type 'FormApi<{ email: string; company_name: string; company_kvk: string; phone: string; password: string; }, undefined>'.

70           error={form.getFieldError('company_name')}
                         ~~~~~~~~~~~~~

src/components/RegisterForm.tsx:73:22 - error TS2339: Property 'getFieldProps' does not exist on type 'FormApi<{ email: string; company_name: string; company_kvk: string; phone: string; password: string; }, undefined>'.

73             {...form.getFieldProps('company_name')}
                        ~~~~~~~~~~~~~

src/components/RegisterForm.tsx:79:23 - error TS2339: Property 'getFieldError' does not exist on type 'FormApi<{ email: string; company_name: string; company_kvk: string; phone: string; password: string; }, undefined>'.

79           error={form.getFieldError('company_kvk')}
                         ~~~~~~~~~~~~~

src/components/RegisterForm.tsx:82:22 - error TS2339: Property 'getFieldProps' does not exist on type 'FormApi<{ email: string; company_name: string; company_kvk: string; phone: string; password: string; }, undefined>'.

82             {...form.getFieldProps('company_kvk')}
                        ~~~~~~~~~~~~~

src/components/RegisterForm.tsx:88:23 - error TS2339: Property 'getFieldError' does not exist on type 'FormApi<{ email: string; company_name: string; company_kvk: string; phone: string; password: string; }, undefined>'.

88           error={form.getFieldError('phone')}
                         ~~~~~~~~~~~~~

src/components/RegisterForm.tsx:92:22 - error TS2339: Property 'getFieldProps' does not exist on type 'FormApi<{ email: string; company_name: string; company_kvk: string; phone: string; password: string; }, undefined>'.

92             {...form.getFieldProps('phone')}
                        ~~~~~~~~~~~~~

src/components/RegisterForm.tsx:98:26 - error TS2339: Property 'isSubmitting' does not exist on type 'FormApi<{ email: string; company_name: string; company_kvk: string; phone: string; password: string; }, undefined>'.

98           disabled={form.isSubmitting}
                            ~~~~~~~~~~~~

src/components/RegisterForm.tsx:100:17 - error TS2339: Property 'isSubmitting' does not exist on type 'FormApi<{ email: string; company_name: string; company_kvk: string; phone: string; password: string; }, undefined>'.

100           {form.isSubmitting ? 'Registering...' : 'Register'}
                    ~~~~~~~~~~~~

src/components/credits/TransactionHistory.tsx:4:15 - error TS2305: Module '"@/types"' has no exported member 'Transaction'.

4 import type { Transaction } from '@/types'
                ~~~~~~~~~~~

src/components/dashboard/AdminDashboardLayout.tsx:19:8 - error TS2613: Module '"/home/websiteofferteaanvragen/htdocs/websiteofferteaanvragen.nl/src/components/NotificationBell"' has no default export. Did you mean to use 'import { NotificationBell } from "/home/websiteofferteaanvragen/htdocs/websiteofferteaanvragen.nl/src/components/NotificationBell"' instead?

19 import NotificationBell from '../NotificationBell';
          ~~~~~~~~~~~~~~~~

src/components/dashboard/AdminLeadCard.tsx:29:61 - error TS2339: Property 'call_status' does not exist on type 'Lead'.

29   onCallStatusChange: (id: string, status: NonNullable<Lead['call_status']>) => void;
                                                               ~~~~~~~~~~~~~

src/components/dashboard/AdminLeadCard.tsx:51:56 - error TS2339: Property 'call_status' does not exist on type 'Lead'.

51   const getCallStatusColor = (status: NonNullable<Lead['call_status']>) => {
                                                          ~~~~~~~~~~~~~

src/components/dashboard/AdminLeadCard.tsx:100:61 - error TS2339: Property 'email' does not exist on type 'Lead'.

100               <span className="text-sm text-gray-600">{lead.email || 'Onbekend'}</span>
                                                                ~~~~~

src/components/dashboard/AdminLeadCard.tsx:104:61 - error TS2339: Property 'phone' does not exist on type 'Lead'.

104               <span className="text-sm text-gray-600">{lead.phone || 'Onbekend'}</span>
                                                                ~~~~~

src/components/dashboard/AdminLeadCard.tsx:126:17 - error TS2339: Property 'ai_verified' does not exist on type 'Lead'.

126           {lead.ai_verified ? (
                    ~~~~~~~~~~~

src/components/dashboard/AdminLeadCard.tsx:136:27 - error TS2339: Property 'call_status' does not exist on type 'Lead'.

136               value={lead.call_status || 'not_called'}
                              ~~~~~~~~~~~

src/components/dashboard/AdminLeadCard.tsx:138:71 - error TS2339: Property 'call_status' does not exist on type 'Lead'.

138                 onCallStatusChange(lead.id, value as NonNullable<Lead['call_status']>)
                                                                          ~~~~~~~~~~~~~

src/components/dashboard/AdminLeadCard.tsx:146:30 - error TS2339: Property 'call_status' does not exist on type 'Lead'.

146                         lead.call_status || 'not_called'
                                 ~~~~~~~~~~~

src/components/dashboard/AdminLeadCard.tsx:149:45 - error TS2339: Property 'call_status' does not exist on type 'Lead'.

149                     {getCallStatusText(lead.call_status || 'not_called')}
                                                ~~~~~~~~~~~

src/components/dashboard/LeadCard.tsx:32:62 - error TS2339: Property 'call_status' does not exist on type 'Lead'.

32   onCallStatusChange?: (id: string, status: NonNullable<Lead['call_status']>) => void;
                                                                ~~~~~~~~~~~~~

src/components/dashboard/LeadCard.tsx:105:25 - error TS2339: Property 'email' does not exist on type 'Lead'.

105                   {lead.email || 'Geen email'}
                            ~~~~~

src/components/dashboard/LeadCard.tsx:111:25 - error TS2339: Property 'phone' does not exist on type 'Lead'.

111                   {lead.phone || 'Geen telefoon'}
                            ~~~~~

src/components/dashboard/LeadCard.tsx:137:31 - error TS2339: Property 'call_status' does not exist on type 'Lead'.

137                   value={lead.call_status || 'not_called'}
                                  ~~~~~~~~~~~

src/components/dashboard/LeadCard.tsx:139:77 - error TS2339: Property 'call_status' does not exist on type 'Lead'.

139                     onCallStatusChange?.(lead.id, value as NonNullable<Lead['call_status']>)
                                                                                ~~~~~~~~~~~~~

src/components/dashboard/LeadCard.tsx:145:83 - error TS2339: Property 'call_status' does not exist on type 'Lead'.

145                         <Phone className={`h-4 w-4 mr-2 ${getCallStatusColor(lead.call_status || 'not_called')}`} />
                                                                                      ~~~~~~~~~~~

src/components/dashboard/LeadCard.tsx:146:31 - error TS2339: Property 'call_status' does not exist on type 'Lead'.

146                         {lead.call_status === 'called' ? 'Gebeld' :
                                  ~~~~~~~~~~~

src/components/dashboard/LeadCard.tsx:147:31 - error TS2339: Property 'call_status' does not exist on type 'Lead'.

147                          lead.call_status === 'unreachable' ? 'Onbereikbaar' :
                                  ~~~~~~~~~~~

src/components/dashboard/LeadTable.tsx:17:61 - error TS2339: Property 'call_status' does not exist on type 'Lead'.

17   onCallStatusChange: (id: string, status: NonNullable<Lead['call_status']>) => void;
                                                               ~~~~~~~~~~~~~

src/components/dashboard/LeadTable.tsx:97:62 - error TS2339: Property 'contact_name' does not exist on type 'Lead'.

97                 <div className="text-sm text-gray-900">{lead.contact_name || 'Onbekend'}</div>
                                                                ~~~~~~~~~~~~

src/components/dashboard/LeadTable.tsx:98:62 - error TS2339: Property 'email' does not exist on type 'Lead'.

98                 <div className="text-sm text-gray-500">{lead.email || 'Geen email'}</div>
                                                                ~~~~~

src/components/dashboard/LeadTable.tsx:109:33 - error TS2339: Property 'call_status' does not exist on type 'Lead'.

109                     value={lead.call_status || 'not_called'}
                                    ~~~~~~~~~~~

src/components/dashboard/LeadTable.tsx:111:77 - error TS2339: Property 'call_status' does not exist on type 'Lead'.

111                       onCallStatusChange(lead.id, value as NonNullable<Lead['call_status']>)
                                                                                ~~~~~~~~~~~~~

src/components/dashboard/LeadTable.tsx:117:85 - error TS2339: Property 'call_status' does not exist on type 'Lead'.

117                           <Phone className={`h-4 w-4 mr-2 ${getCallStatusColor(lead.call_status || 'not_called')}`} />
                                                                                        ~~~~~~~~~~~

src/components/dashboard/LeadTable.tsx:118:33 - error TS2339: Property 'call_status' does not exist on type 'Lead'.

118                           {lead.call_status === 'called' ? 'Called' :
                                    ~~~~~~~~~~~

src/components/dashboard/LeadTable.tsx:119:33 - error TS2339: Property 'call_status' does not exist on type 'Lead'.

119                            lead.call_status === 'unreachable' ? 'Unreachable' :
                                    ~~~~~~~~~~~

src/components/dashboard/MarketerDashboardLayout.tsx:18:8 - error TS2613: Module '"/home/websiteofferteaanvragen/htdocs/websiteofferteaanvragen.nl/src/components/NotificationBell"' has no default export. Did you mean to use 'import { NotificationBell } from "/home/websiteofferteaanvragen/htdocs/websiteofferteaanvragen.nl/src/components/NotificationBell"' instead?

18 import NotificationBell from '../NotificationBell';
          ~~~~~~~~~~~~~~~~

src/components/dashboard/TransactionHistory.tsx:14:15 - error TS2305: Module '"@/types"' has no exported member 'Transaction'.

14 import type { Transaction } from '@/types';
                 ~~~~~~~~~~~

src/components/notifications/CreditNotifications.tsx:9:15 - error TS2339: Property 'credits' does not exist on type 'UserWithRole'.

9     if (user?.credits < 5) {
                ~~~~~~~

src/components/notifications/CreditNotifications.tsx:12:13 - error TS2339: Property 'credits' does not exist on type 'UserWithRole'.

12   }, [user?.credits])
               ~~~~~~~

src/pages/AdminLogin.tsx:31:11 - error TS1345: An expression of type 'void' cannot be tested for truthiness.

31       if (adminUser) {
             ~~~~~~~~~

src/pages/LeadDetailsPage.tsx:155:5 - error TS2339: Property 'email' does not exist on type 'Lead'.

155     email,
        ~~~~~

src/pages/LeadDetailsPage.tsx:156:5 - error TS2339: Property 'phone' does not exist on type 'Lead'.

156     phone,
        ~~~~~

src/pages/LeadDetailsPage.tsx:157:5 - error TS2339: Property 'location' does not exist on type 'Lead'.

157     location,
        ~~~~~~~~

src/pages/LeadDetailsPage.tsx:158:5 - error TS2339: Property 'technical_requirements' does not exist on type 'Lead'.

158     technical_requirements,
        ~~~~~~~~~~~~~~~~~~~~~~

src/pages/LeadDetailsPage.tsx:159:5 - error TS2339: Property 'call_status' does not exist on type 'Lead'.

159     call_status
        ~~~~~~~~~~~

src/pages/LeadsPage.tsx:9:10 - error TS2440: Import declaration conflicts with local declaration of 'Lead'.

9 import { Lead } from '../types';
           ~~~~

src/pages/LeadsPage.tsx:73:48 - error TS2304: Cannot find name 'handleViewLead'.

73         <Button variant="ghost" onClick={() => handleViewLead(lead.id)}>
                                                  ~~~~~~~~~~~~~~

src/pages/LeadsPage.tsx:86:48 - error TS2304: Cannot find name 'Quote'.

86   const [myLeads, setMyLeads] = React.useState<Quote[]>([]);
                                                  ~~~~~

src/pages/LeadsPage.tsx:97:5 - error TS2322: Type 'import("/home/websiteofferteaanvragen/htdocs/websiteofferteaanvragen.nl/src/types").Lead[]' is not assignable to type 'Lead[]'.
  Property 'title' is missing in type 'import("/home/websiteofferteaanvragen/htdocs/websiteofferteaanvragen.nl/src/types").Lead' but required in type 'Lead'.

97     data: leads ?? [],
       ~~~~

  src/pages/LeadsPage.tsx:40:3
    40   title: string
         ~~~~~
    'title' is declared here.
  src/lib/table.ts:10:3
    10   data: TData[]
         ~~~~
    The expected type comes from property 'data' which is declared here on type 'UseTableProps<Lead>'

src/pages/LeadsPage.tsx:164:14 - error TS2339: Property 'company_name' does not exist on type 'Lead'.

164         lead.company_name?.toLowerCase().includes(filters.search.toLowerCase()) ||
                 ~~~~~~~~~~~~

src/pages/LeadsPage.tsx:165:14 - error TS2339: Property 'project_description' does not exist on type 'Lead'.

165         lead.project_description?.toLowerCase().includes(filters.search.toLowerCase())
                 ~~~~~~~~~~~~~~~~~~~

src/pages/LeadsPage.tsx:168:58 - error TS2339: Property 'budget_range' does not exist on type 'Lead'.

168       const matchesBudget = !filters.budgetRange || lead.budget_range === filters.budgetRange;
                                                             ~~~~~~~~~~~~

src/pages/LeadsPage.tsx:169:57 - error TS2339: Property 'timeline' does not exist on type 'Lead'.

169       const matchesTimeline = !filters.timeline || lead.timeline === filters.timeline;
                                                            ~~~~~~~~

src/pages/LeadsPage.tsx:219:34 - error TS2345: Argument of type '{ id: string; title?: string | undefined; status?: string | undefined; created_at?: string | undefined; }' is not assignable to parameter of type 'Partial<Lead>'.
  Types of property 'status' are incompatible.
    Type 'string | undefined' is not assignable to type '"pending" | "approved" | "rejected" | undefined'.
      Type 'string' is not assignable to type '"pending" | "approved" | "rejected" | undefined'.

219     await updateLead.mutateAsync({
                                     ~
220       id,
    ~~~~~~~~~
221       ...data
    ~~~~~~~~~~~~~
222     });
    ~~~~~

src/pages/LeadsPage.tsx:226:14 - error TS2345: Argument of type 'string' is not assignable to parameter of type 'NavigateOptions<Router<any, TrailingSlashOption, boolean, RouterHistory, Record<string, any>, Record<string, any>>, string, string | undefined, string, "">'.
  Type 'string' is not assignable to type 'MakeOptionalSearchParams<Router<any, TrailingSlashOption, boolean, RouterHistory, Record<string, any>, Record<string, any>>, string, string | undefined>'.

226     navigate(`/leads/${id}`);
                 ~~~~~~~~~~~~~~

src/pages/LeadsPage.tsx:321:56 - error TS2339: Property 'company_name' does not exist on type 'Lead'.

321                       <span className="truncate">{lead.company_name}</span>
                                                           ~~~~~~~~~~~~

src/pages/LeadsPage.tsx:329:29 - error TS2339: Property 'project_description' does not exist on type 'Lead'.

329                       {lead.project_description}
                                ~~~~~~~~~~~~~~~~~~~

src/pages/LeadsPage.tsx:335:37 - error TS2339: Property 'budget_range' does not exist on type 'Lead'.

335                         <span>{lead.budget_range}</span>
                                        ~~~~~~~~~~~~

src/pages/LeadsPage.tsx:339:37 - error TS2339: Property 'timeline' does not exist on type 'Lead'.

339                         <span>{lead.timeline}</span>
                                        ~~~~~~~~

src/pages/LeadsPage.tsx:343:37 - error TS2339: Property 'location' does not exist on type 'Lead'.

343                         <span>{lead.location || 'Nederland'}</span>
                                        ~~~~~~~~

src/pages/LeadsPage.tsx:393:17 - error TS2740: Type 'Lead' is missing the following properties from type 'Lead': company_name, description, project_description, budget_range, and 3 more.

393                 lead={quote.leads as Lead}
                    ~~~~

  src/components/dashboard/LeadCard.tsx:30:3
    30   lead: Lead;
         ~~~~
    The expected type comes from property 'lead' which is declared here on type 'IntrinsicAttributes & LeadCardProps'

src/pages/LeadsPage.tsx:409:9 - error TS2322: Type 'import("/home/websiteofferteaanvragen/htdocs/websiteofferteaanvragen.nl/src/types").Lead[] | undefined' is not assignable to type 'Lead[] | undefined'.
  Type 'import("/home/websiteofferteaanvragen/htdocs/websiteofferteaanvragen.nl/src/types").Lead[]' is not assignable to type 'Lead[]'.
    Property 'title' is missing in type 'import("/home/websiteofferteaanvragen/htdocs/websiteofferteaanvragen.nl/src/types").Lead' but required in type 'Lead'.

409         data={leads}
            ~~~~

  src/pages/LeadsPage.tsx:40:3
    40   title: string
         ~~~~~
    'title' is declared here.
  src/components/ui/data-table.tsx:23:3
    23   data?: TData[]
         ~~~~
    The expected type comes from property 'data' which is declared here on type 'IntrinsicAttributes & DataTableProps<Lead>'

src/pages/LeadsPage.tsx:411:32 - error TS2339: Property 'isLoading' does not exist on type 'UseMutationResult<never, Error, Partial<Lead>, unknown>'.
  Property 'isLoading' does not exist on type 'Override<MutationObserverIdleResult<never, Error, Partial<Lead>, unknown>, { mutate: UseMutateFunction<never, Error, Partial<Lead>, unknown>; }> & { ...; }'.

411         isUpdating={updateLead.isLoading}
                                   ~~~~~~~~~

src/pages/MarketerDashboard.tsx:202:14 - error TS2741: Property 'transactions' is missing in type '{}' but required in type 'TransactionHistoryProps'.

202             <TransactionHistory />
                 ~~~~~~~~~~~~~~~~~~

  src/components/credits/TransactionHistory.tsx:16:3
    16   transactions: Transaction[];
         ~~~~~~~~~~~~
    'transactions' is declared here.

src/pages/SubscriptionPage.tsx:181:8 - error TS2741: Property 'transactions' is missing in type '{}' but required in type 'TransactionHistoryProps'.

181       <TransactionHistory />
           ~~~~~~~~~~~~~~~~~~

  src/components/dashboard/TransactionHistory.tsx:17:3
    17   transactions: Transaction[];
         ~~~~~~~~~~~~
    'transactions' is declared here.

src/pages/admin/AdminSettingsPage.tsx:67:10 - error TS18047: 'settings' is possibly 'null'.

67       ...settings[key],
            ~~~~~~~~

src/pages/admin/AdminSettingsPage.tsx:67:10 - error TS7053: Element implicitly has an 'any' type because expression of type 'string' can't be used to index type 'Settings'.
  No index signature with a parameter of type 'string' was found on type 'Settings'.

67       ...settings[key],
            ~~~~~~~~~~~~~

src/pages/admin/AdminSettingsPage.tsx:108:19 - error TS2322: Type 'boolean' is not assignable to type 'string | number | readonly string[] | undefined'.

108                   value={settings.lead_matching.min_score}
                      ~~~~~

  node_modules/@types/react/index.d.ts:3398:9
    3398         value?: string | readonly string[] | number | undefined;
                 ~~~~~
    The expected type comes from property 'value' which is declared here on type 'IntrinsicAttributes & Omit<DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>, "ref"> & RefAttributes<...>'

src/pages/admin/AdminSettingsPage.tsx:124:19 - error TS2322: Type 'boolean' is not assignable to type 'string | number | readonly string[] | undefined'.

124                   value={settings.lead_matching.max_matches_per_lead}
                      ~~~~~

  node_modules/@types/react/index.d.ts:3398:9
    3398         value?: string | readonly string[] | number | undefined;
                 ~~~~~
    The expected type comes from property 'value' which is declared here on type 'IntrinsicAttributes & Omit<DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>, "ref"> & RefAttributes<...>'

src/pages/admin/AdminSettingsPage.tsx:191:19 - error TS2322: Type 'boolean' is not assignable to type 'string | number | readonly string[] | undefined'.

191                   value={settings.ai_verification.min_confidence}
                      ~~~~~

  node_modules/@types/react/index.d.ts:3398:9
    3398         value?: string | readonly string[] | number | undefined;
                 ~~~~~
    The expected type comes from property 'value' which is declared here on type 'IntrinsicAttributes & Omit<DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>, "ref"> & RefAttributes<...>'

src/pages/settings/PortfolioPage.tsx:58:69 - error TS2345: Argument of type '{ title: string; description: string; url: string; technologies: never[]; budget_range: string; completion_date: string; project_type: string; industry: string; team_size: number; development_time: number; client_testimonial: string; expertise_level: "medior"; }' is not assignable to parameter of type 'Portfolio | (() => Portfolio)'.
  Type '{ title: string; description: string; url: string; technologies: never[]; budget_range: string; completion_date: string; project_type: string; industry: string; team_size: number; development_time: number; client_testimonial: string; expertise_level: "medior"; }' is missing the following properties from type 'Portfolio': id, images

 58   const [newPortfolio, setNewPortfolio] = React.useState<Portfolio>({
                                                                        ~
 59     title: '',
    ~~~~~~~~~~~~~~
...
 70     expertise_level: 'medior',
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 71   });
    ~~~

src/pages/settings/PortfolioPage.tsx:105:51 - error TS2339: Property 'split' does not exist on type 'string[]'.

105           technologies: newPortfolio.technologies.split(',').map(t => t.trim()),
                                                      ~~~~~

src/pages/settings/PortfolioPage.tsx:105:66 - error TS7006: Parameter 't' implicitly has an 'any' type.

105           technologies: newPortfolio.technologies.split(',').map(t => t.trim()),
                                                                     ~

src/pages/settings/PortfolioPage.tsx:121:23 - error TS2345: Argument of type '{ title: string; description: string; url: string; technologies: never[]; budget_range: string; completion_date: string; project_type: string; industry: string; team_size: number; development_time: number; client_testimonial: string; expertise_level: "medior"; }' is not assignable to parameter of type 'SetStateAction<Portfolio>'.
  Type '{ title: string; description: string; url: string; technologies: never[]; budget_range: string; completion_date: string; project_type: string; industry: string; team_size: number; development_time: number; client_testimonial: string; expertise_level: "medior"; }' is missing the following properties from type 'Portfolio': id, images

121       setNewPortfolio({
                          ~
122         title: '',
    ~~~~~~~~~~~~~~~~~~
...
133         expertise_level: 'medior',
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
134       });
    ~~~~~~~

src/router/index.ts:2:10 - error TS2305: Module '"./routes"' has no exported member 'routes'.

2 import { routes } from './routes'
           ~~~~~~

src/services/aiService.ts:85:12 - error TS2339: Property 'max_quotes' does not exist on type 'Lead'.

85       lead.max_quotes / 5,
              ~~~~~~~~~~

src/services/aiService.ts:86:12 - error TS2339: Property 'email' does not exist on type 'Lead'.

86       lead.email && lead.phone ? 1 : 0,
              ~~~~~

src/services/aiService.ts:86:26 - error TS2339: Property 'phone' does not exist on type 'Lead'.

86       lead.email && lead.phone ? 1 : 0,
                            ~~~~~

src/store/adminAuthStore.ts:4:15 - error TS2305: Module '"@/types"' has no exported member 'UserWithRole'.

4 import type { UserWithRole } from '@/types';
                ~~~~~~~~~~~~
